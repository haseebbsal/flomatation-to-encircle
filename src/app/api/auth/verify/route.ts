import userModel from "@/database/users";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { accessToken, refreshToken, locationid } = await req.json()
    const client_id = '664f3f21e941e37cdd9d3e85-lwj9o1qx'
    const client_secret = 'ae6cec39-025e-4b8b-9e7e-138077a30c52'
    const checkAccessToken = await fetch(`https://services.leadconnectorhq.com/opportunities/search?limit=1&startAfter=0&location_id=${locationid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
    const data = await checkAccessToken.json()
    if (!data.opportunities) {
        await mongoose.connect(process.env.MONGO_URL!)
        let refreshTokenFetch = await fetch(`https://services.leadconnectorhq.com/oauth/token`, { body:`client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`, method: 'POST', headers: { 'Content-type': 'application/x-www-form-urlencoded' } })
        const { userId, locationId, access_token, refresh_token } = await refreshTokenFetch.json()
        await userModel.updateOne({ id: userId }, { $set: { refreshToken: refresh_token, accessToken: access_token, locationId } })
        const cookie = cookies()
        cookie.set('accessToken', access_token)
        cookie.set('refreshToken', refresh_token)
        cookie.set('locationid', locationId)
    }
    return NextResponse.json({ msg: 'good' })
}