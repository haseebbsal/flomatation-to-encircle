import userModel from "@/database/users";
import axios from "axios";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
const qs = require('qs');
export async function GET(req: NextRequest) {
    const code=req.nextUrl.searchParams.get('code')
    // console.log(req.query.code)
    const data = qs.stringify({
        'client_id': "664f3f21e941e37cdd9d3e85-lwj9o1qx",
        'client_secret': "ae6cec39-025e-4b8b-9e7e-138077a30c52",
        'grant_type': 'authorization_code',
        'code': code,
        'user_type': 'Location',
        'redirect_uri': 'http://localhost:8050/oauth/callback'
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    const response = await axios.request(config).catch(err => { });
    const { userId, refresh_token, access_token ,locationId} = (response as any).data
    await mongoose.connect(process.env.MONGO_URL!)
    const userInfo = await userModel.findOne({ id: userId })
    console.log(locationId)
    if (!userInfo) {
        console.log('created new user')
        await userModel.create({ id: userId, refreshToken: refresh_token, accessToken: access_token, locationId })
    }
    else {
        console.log('updated user')
        await userModel.updateOne({id:userId},{$set:{refreshToken:refresh_token,accessToken:access_token,locationId}})
    }

    const cookie = cookies()
    cookie.set('accessToken', access_token)
    cookie.set('refreshToken', refresh_token)
    cookie.set('locationid', locationId)
    redirect('/app/property-claims')
}