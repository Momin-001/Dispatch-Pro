import Image from "next/image";
import { cn } from "@/lib/utils";

export function AboutHero() {
    return (
        <section className="relative w-full overflow-hidden">
            <Image
                className="absolute inset-0 object-cover"
                src="/about-hero.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                aria-hidden
            />
            <div className="absolute inset-0 bg-primary-dark/50" aria-hidden />

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pt-24 pb-22 sm:px-6 sm:pt-28 lg:px-8">
                <div className="max-w-3xl">
                    <div
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-background sm:text-sm"
                        )}
                    >
                        <span>ABOUT US</span>
                    </div>

                    <h1 className="mt-6 text-4xl font-bold leading-tight text-background drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
                        Building the Future
                        <br />
                        of Dispatch
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-background/70 sm:text-xl">
                        We're more than a dispatch service – we're your dedicated partner in success, committed to maximizing efficiency and profitability for every driver and shipper we serve.
                    </p>
                </div>
            </div>
        </section>
    );
}
