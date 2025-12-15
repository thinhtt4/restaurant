
import Header from "@/components/layouts/guest/Header"
import { Outlet } from "react-router-dom";
import "@/styles/home.css"
export default function HomeLayout() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            
        </>
    );
}
