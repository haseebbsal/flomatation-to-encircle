import userModel from "@/database/users";
import mongoose from "mongoose";
export const revalidate = 0
export async function GET() {
    await mongoose.connect(process.env.MONGO_URL)
    const users = await userModel.find()
    users.forEach(async (e) => {
        const client_id = '664f3f21e941e37cdd9d3e85-lwj9o1qx'
        const client_secret = 'ae6cec39-025e-4b8b-9e7e-138077a30c52'
        let { accessToken, refreshToken, locationId } = e
        const checkAccessToken = await fetch(`https://services.leadconnectorhq.com/opportunities/search?limit=1&startAfter=0&location_id=${locationId}&pipeline_stage_id=cfab87e0-3d0c-4ea0-a94d-22d5db912376`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
        const data = await checkAccessToken.json()
        if (!data.opportunities) {
            let refreshTokenFetch = await fetch(`https://services.leadconnectorhq.com/oauth/token`, { body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`, method: 'POST', headers: { 'Content-type': 'application/x-www-form-urlencoded' } })
            const { userId, locationId, access_token, refresh_token } = await refreshTokenFetch.json()
            console.log(userId, locationId, access_token, refresh_token)
            await userModel.updateOne({ id: userId }, { $set: { refreshToken: refresh_token, accessToken: access_token, locationId } })
            accessToken = access_token
            refreshToken = refresh_token
            console.log('refresh token fetching')
            const checkAccessToken = await fetch(`https://services.leadconnectorhq.com/opportunities/search?limit=1&startAfter=0&location_id=${locationId}&pipeline_stage_id=cfab87e0-3d0c-4ea0-a94d-22d5db912376`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
            const data = await checkAccessToken.json()
            const total_data = []
            async function fetchRecursiveFlomatation() {
                let startAfter = 0
                while (true) {
                    const checkAccessToken = await fetch(`https://services.leadconnectorhq.com/opportunities/search?limit=100&startAfter=${startAfter}&location_id=${locationId}&pipeline_stage_id=cfab87e0-3d0c-4ea0-a94d-22d5db912376`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                    const data = await checkAccessToken.json()
                    for (let j of data.opportunities) {
                        const { status, createdAt, assignedTo, contactId } = j
                        const { name, email, phone } = j.contact
                        const getOwnerFetch = await fetch(`https://services.leadconnectorhq.com/users/${assignedTo}`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                        const { name: ownerName } = await getOwnerFetch.json()
                        const getUserAddressFetch = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                        const { address1, city, state, country, postalCode } = (await getUserAddressFetch.json()).contact
                        const newAddress = `${address1 ? address1 : ''} ${city ? city : ''} ${state ? state : ''} ${country ? country : ''} ${postalCode ? postalCode : ''}`
                        total_data.push({ name, email, phone, status, createdAt, ownerName: ownerName ? ownerName : '', address: newAddress })
                    }
                    if (data.meta.nextPage) {
                        startAfter = data.meta.startAfter
                    }
                    else {
                        break
                    }
                }
                return total_data
            }
            async function fetchRecursiveEncircle(flomatationData) {
                let filteredData = [];
                for (let j of flomatationData) {
                    let data = await fetch(`https://api.encircleapp.com/v1/property_claims?limit=1&policyholder_name=${j.name} `, { headers: { "Authorization": "Bearer 05e8a67f-1984-4107-95f9-c464ca6ca19e" } })
                    data = await data.json()
                    if (data.list.length == 0) {
                        filteredData.push(j)
                    }
                }
                return filteredData
            }
            if (data.opportunities.length != 0) {
                const allDataFlomatation = await fetchRecursiveFlomatation()
                console.log(allDataFlomatation)
                console.log(allDataFlomatation.length)
                const allDataEncircle = await fetchRecursiveEncircle(allDataFlomatation)
                const organisationId = '302156b5-4674-427d-bad6-adc97da1291a'
                const brand_id = 120971
                console.log('Filtered Data', allDataEncircle)
                for (let j of allDataEncircle) {
                    if (j.status == 'open') {
                        const uploadToEncircle = await fetch('https://api.encircleapp.com/v1/property_claims', { method: "POST", body: JSON.stringify({ organization_id: organisationId, brand_id, policyholder_name: j.name, policyholder_email_address: j.email, policyholder_phone_number: j.phone, project_manager_name: j.ownerName, full_address: j.address }), headers: { "Authorization": "Bearer 05e8a67f-1984-4107-95f9-c464ca6ca19e", "Content-Type": "application/json" } })
                    }
                }
                console.log('Uploaded Successfully')
            }
        }
        else {
            const total_data = []
            async function fetchRecursiveFlomatation() {
                let startAfter = 0
                while (true) {
                    const checkAccessToken = await fetch(`https://services.leadconnectorhq.com/opportunities/search?limit=100&startAfter=${startAfter}&location_id=${locationId}&pipeline_stage_id=cfab87e0-3d0c-4ea0-a94d-22d5db912376`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                    const data = await checkAccessToken.json()
                    for (let j of data.opportunities) {
                        const { status, createdAt, assignedTo, contactId } = j
                        const { name, email, phone } = j.contact
                        const getOwnerFetch = await fetch(`https://services.leadconnectorhq.com/users/${assignedTo}`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                        const { name: ownerName } = await getOwnerFetch.json()
                        const getUserAddressFetch = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Version': '2021-07-28' } })
                        const { address1, city, state, country, postalCode } = (await getUserAddressFetch.json()).contact
                        const newAddress = `${address1 ? address1 : ''} ${city ? city : ''} ${state ? state : ''} ${country ? country : ''} ${postalCode ? postalCode : ''}`
                        total_data.push({ name, email, phone, status, createdAt, ownerName: ownerName ? ownerName : '', address: newAddress })
                    }
                    if (data.meta.nextPage) {
                        startAfter = data.meta.startAfter
                    }
                    else {
                        break
                    }
                }
                return total_data
            }
            async function fetchRecursiveEncircle(flomatationData) {
                let filteredData = [];
                for (let j of flomatationData) {
                    let data = await fetch(`https://api.encircleapp.com/v1/property_claims?limit=1&policyholder_name=${j.name} `, { headers: { "Authorization": "Bearer 05e8a67f-1984-4107-95f9-c464ca6ca19e" } })
                    data = await data.json()
                    if (data.list.length == 0) {
                        filteredData.push(j)
                    }
                }
                return filteredData
            }
            if (data.opportunities.length != 0) {
                const allDataFlomatation = await fetchRecursiveFlomatation()
                console.log(allDataFlomatation)
                console.log(allDataFlomatation.length)
                const allDataEncircle = await fetchRecursiveEncircle(allDataFlomatation)
                const organisationId = '302156b5-4674-427d-bad6-adc97da1291a'
                const brand_id = 120971
                console.log('Filtered Data', allDataEncircle)
                for (let j of allDataEncircle) {
                    if (j.status == 'open') {
                        const uploadToEncircle = await fetch('https://api.encircleapp.com/v1/property_claims', { method: "POST", body: JSON.stringify({ organization_id: organisationId, brand_id, policyholder_name: j.name, policyholder_email_address: j.email, policyholder_phone_number: j.phone, project_manager_name: j.ownerName, full_address: j.address }), headers: { "Authorization": "Bearer 05e8a67f-1984-4107-95f9-c464ca6ca19e", "Content-Type": "application/json" } })
                    }
                }
                console.log('Uploaded Successfully')
            }
        }
    })
    console.log('running a task every minute');
}