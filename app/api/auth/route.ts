import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publicKey, signature, message } = body;

        if (!publicKey || !signature || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify signature
        try {
            const signatureUint8 = bs58.decode(signature);
            const messageUint8 = new TextEncoder().encode(message);
            const publicKeyUint8 = bs58.decode(publicKey);

            const isValid = nacl.sign.detached.verify(
                messageUint8,
                signatureUint8,
                publicKeyUint8
            );

            if (!isValid) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        } catch {
            return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
        }

        const user = await prisma.user.upsert({
            where: {
                publicKey: publicKey
            },
            update: {},
            create: {
                publicKey: publicKey,
            }
        })
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}