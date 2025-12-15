interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface HeroProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    backgroundImage?: string;
}

export default function Hero({
    title,
    breadcrumbs,
    backgroundImage = '/10.jpg'
}: HeroProps) {
    return (
        <section className="mt-20 py-16 md:py-24 bg-gradient-to-b from-black/60 to-black/40 relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-30 bg-cover bg-center"
                style={{
                    backgroundImage: `url('${backgroundImage}')`,
                }}
            />
            <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    {title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-white">
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {item.href ? (
                                <a href={item.href} className="text-accent hover:underline">
                                    {item.label}
                                </a>
                            ) : (
                                <span>{item.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span>/</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}