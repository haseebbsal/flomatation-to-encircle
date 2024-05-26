import QueryProvider from "@/providers/QueryProvider"
import Link from "next/link"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex min-h-[100vh] max-h-auto">
                <div className="w-[20%] bg-gray-600 flex flex-col items-center p-4 gap-3 text-white">
                    <h2 className="text-3xl">Encircle</h2>
                    {/* <Link href={'/app/property-claims'}>Property Claims</Link> */}
                </div>
                <div className="w-full">
                    <div className="text-center p-4 text-lg border-b-4">Claim Inbox</div>
                    <div className="p-4">
                        <QueryProvider>
                            {children}
                        </QueryProvider>
                    </div>
                </div>
            </div>
        </>
    )
}