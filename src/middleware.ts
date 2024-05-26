import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const cookie = cookies()
    const accessToken = cookie.get('accessToken')
    const refreshToken = cookie.get('refreshToken')
    const locationid = cookie.get('locationid')
    if (!accessToken || !refreshToken || !locationid) {
        return NextResponse.redirect(`https://marketplace.leadconnectorhq.com/oauth/chooselocation?response_type=code&redirect_uri=http://localhost:8050/api/oauth/callback&client_id=664f3f21e941e37cdd9d3e85-lwj9o1qx&scope=opportunities.readonly opportunities.write contacts.readonly users.readonly`)
    }
    else {
        const data = await fetch(`${process.env.BASE_URL}/api/auth/verify`, { credentials: 'include', method: "POST", body: JSON.stringify({ accessToken: accessToken?.value, refreshToken: refreshToken?.value, locationid: locationid?.value }), headers: { 'Content-type': 'application/json' } })
        if (req.nextUrl.pathname == '/') {
            return NextResponse.redirect(new URL('/app/property-claims',req.nextUrl.origin))
        }
    }
}


export const config = {
    matcher: [
        '/',
        '/app/property-claims'
    ]
}