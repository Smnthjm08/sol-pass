import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: publicKey } = await params;
        const body = await req.json();
        const { username, email, bio } = body;

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: { publicKey },
            data: {
                username,
                email: email || null,
                bio: bio || null,
            },
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
        console.error(error);
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: string }).code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/user/[publicKey] — fetch a user by publicKey
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: publicKey } = await params;
        const user = await prisma.user.findUnique({
            where: { publicKey },
            include: {
                events: {
                    orderBy: { date: "asc" },
                    include: {
                        _count: { select: { tickets: true } },
                    },
                },
                tickets: {
                    include: {
                        event: {
                            include: {
                                creator: { select: { username: true, publicKey: true } },
                                _count: { select: { tickets: true } },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}