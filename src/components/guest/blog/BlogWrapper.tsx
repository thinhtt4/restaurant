import { LikesProvider } from "@/lib/likes-provider";
import { Outlet } from "react-router-dom";


export function BlogWrapper() {
    return (
        <LikesProvider>
            {/* Outlet sẽ render BlogHome hoặc BlogDetail */}
            <Outlet />
        </LikesProvider>
    );
}