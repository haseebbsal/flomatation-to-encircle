'use client'
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useInfiniteQuery } from "react-query";
import { ImSpinner2 } from "react-icons/im";
export default function PropertyClaims() {
    const [search,setSearch]=useState<null| string>(null)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isFetchingNextPage
    } = useInfiniteQuery(['infiniteQuery', search], ({ pageParam = 0 }) => fetch(`https://api.encircleapp.com/v1/property_claims${pageParam ? `?after=${pageParam}` : ''}${search ? `?policyholder_name=${search}` : ''} `, { headers: { "Authorization": "Bearer 05e8a67f-1984-4107-95f9-c464ca6ca19e" } }).then((e) => e.json()), {
        getNextPageParam: (lastPage, pages) => lastPage.cursor.after,
        refetchOnWindowFocus:false,
        refetchInterval: 5000,
        refetchIntervalInBackground:true
    })
    return (
        <>
            <div className="flex justify-evenly">
                <div className=" border border-1 rounded w-[50%] h-[2rem] flex">
                    <div className="h-full border-r px-2"><CiSearch className="h-full text-xl" /></div>
                    <input className=" h-full w-full outline-none" placeholder="Search" type="text" onChange={(e) => {
                        setSearch(e.target.value)
                    }}/>
                </div>
                {/* <button className="bg-gray-600 px-4 py-2 rounded text-white">Filter</button> */}
            </div>
            <div className="p-4 overflow-auto h-[27rem]">
                {isFetching && isLoading && !isFetchingNextPage && <p className="text-center">Fetching Property Claims</p>}
                { !isLoading && data?.pages[0].list.length>0 &&
                    <table>
                        <tbody>
                            <tr>
                                <td><p className="font-bold p-2">Policy Holder Name</p></td>
                                <td><p className="font-bold p-2">Full Address</p></td>
                                <td><p className="font-bold p-2">Date</p></td>
                            </tr>
                            {data?.pages.map((e: any) =>
                                e.list.map((j: any,index:number) =>
                                    <tr key={index}>
                                        <td><a href={j.permalink_url} target="_blank" className="text-blue-600 p-2">{j.policyholder_name}</a></td>
                                        <td><p className="p-2">{j.full_address}</p></td>
                                        <td><p className="p-2">{j.date_claim_created}</p></td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                }
                {!isFetching && !isLoading && data?.pages[0].list.length == 0 && <p className="text-center">No Data For That Search</p>}
                <br />
            </div>
            <div className="text-center mt-2">

                { !isLoading && hasNextPage && <button onClick={() => fetchNextPage()} className="w-full p-2 orange text-white flex justify-center">{isFetchingNextPage ? <ImSpinner2 className="animate-spin"/> :'Next Page'}</button>}
            </div>
        </>
    )
}