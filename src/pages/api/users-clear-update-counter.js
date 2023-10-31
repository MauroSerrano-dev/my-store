import { NextResponse } from 'next/server';

export default function handler(request) {
    const authHeader = request.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { success: false },
            {
                status: 401,
            },
        );
    }

    return NextResponse.json({ success: true });
}