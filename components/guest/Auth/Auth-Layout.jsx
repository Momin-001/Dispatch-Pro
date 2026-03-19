import { CircleCheckBig, Truck } from "lucide-react";
import Link from "next/link";

export const AuthLayoutComponent = ({ title, subtitle, features, children, }) => {
    return (
        <div className="min-h-screen flex py-10 items-center px-4 justify-center gradient">
            <div className="flex md:flex-row flex-col w-[900px] h-full rounded-2xl overflow-hidden shadow-xl">

                {/* LEFT PANEL */}
                <div className="md:w-1/2 w-full gradient text-white p-10 flex flex-col justify-between">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">

                            <div className="flex size-9 items-center justify-center rounded-lg bg-background/20">
                                <Truck className="size-5 text-background" />
                            </div>
                            <Link
                                href="/"
                                className="flex shrink-0 items-center text-lg font-bold tracking-tight sm:text-xl"
                                aria-label="Dispatch Pro home"
                            >
                                <span className="text-background">DISPATCH</span>
                                <span className="text-secondary">PRO</span>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4">{title}</h1>
                            <p className="mb-6 text-sm opacity-80">{subtitle}</p>

                            <ul className="space-y-2 mb-8">
                                {features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-background/20">
                                            <CircleCheckBig className="size-4 text-background" />
                                        </div>
                                        <p className="text-sm text-background/80">{f}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="text-xs opacity-50">© 2026 DispatchPro. All rights reserved.</p>
                </div>

                {/* RIGHT PANEL (FORM SLOT) */}
                <div className="md:w-1/2 w-full bg-white p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}