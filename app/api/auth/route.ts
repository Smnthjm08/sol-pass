import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        const user = await prisma.user.upsert({
            where: {
                publicKey: body.publicKey
            },
            update: {},
            create: {
                publicKey: body.publicKey,
            }
        })
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}