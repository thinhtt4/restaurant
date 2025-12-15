import Hero from "@/components/guest/home/hero"
import About from "@/components/guest/home/about"
import MenuShowcase from "@/components/guest/home/menu-showcase"
import "@/styles/home.css"
import ComboVoucherShowcase from "@/components/guest/home/ComboVoucherShowcase"
import { useRef } from "react"
import Footer from "@/components/layouts/guest/Footer"
export default function Home() {

    const tableFilterRef = useRef<HTMLDivElement | null>(null);

    return (
        <main className="min-h-screen bg-background">
            <Hero onBookTableClick={() => {
                tableFilterRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }} />

            <ComboVoucherShowcase />

            <About tableFilterRef={tableFilterRef} />

            <MenuShowcase />
            <Footer />
        </main>
    )
}