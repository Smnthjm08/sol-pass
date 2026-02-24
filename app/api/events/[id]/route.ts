import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log("[API] Fetching event with ID:", id);

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, username: true, publicKey: true } },
                _count: { select: { tickets: true } },
            },
        });

        console.log("[API] Found event:", event ? "Yes" : "No");

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error("[GET /api/events/[id]]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
