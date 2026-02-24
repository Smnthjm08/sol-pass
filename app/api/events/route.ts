import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            publicKey,
            name,
            description,
            date,
            location,
            capacity,
            price,
            isFree,
            isOnline,
            isOffline,
            image,
        } = body;

        if (!publicKey) {
            return NextResponse.json({ error: "Wallet not connected" }, { status: 401 });
        }
        if (!name || !description || !date) {
            return NextResponse.json(
                { error: "Name, description, and date are required" },
                { status: 400 }
            );
        }

        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }
        if (eventDate < new Date()) {
            return NextResponse.json({ error: "Event date must be in the future" }, { status: 400 });
        }

        if (!isFree && (price === undefined || price === null || Number(price) <= 0)) {
            return NextResponse.json({ error: "Price is required for paid events" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { publicKey } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const event = await prisma.event.create({
            data: {
                name,
                description,
                date: new Date(date),
                location: location || null,
                capacity: capacity ? Number(capacity) : null,
                price: isFree ? null : price ? Number(price) : null,
                isFree: Boolean(isFree),
                isOnline: Boolean(isOnline),
                isOffline: Boolean(isOffline),
                image: image || null,
                creatorId: user.id,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: "asc" },
            include: {
                creator: {
                    select: { id: true, username: true, publicKey: true },
                },
                _count: { select: { tickets: true } },
            },
        });
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
