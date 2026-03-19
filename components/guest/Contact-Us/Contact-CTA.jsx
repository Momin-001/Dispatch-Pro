import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactCTA() {
    return (
        <section className="bg-primary-dark/95 py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                    <MessageCircle className="size-14 text-background/90" aria-hidden />

                    <h2 className="mt-5 text-3xl font-bold leading-tight text-background sm:text-4xl">
                        Ready to Get Started?
                    </h2>
                    <p className="mt-4 text-base text-background/80 sm:text-lg">
                        Join hundreds of satisfied drivers, owner-operators, and shippers who trust DispatchPro
                    </p>

                    <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                        <Button variant="destructive" size="lg" asChild className="w-full sm:w-auto">
                            <Link href="/contact">Apply Now</Link>
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link className="flex items-center gap-2" href="/contact-us">
                                <Phone className="size-4" aria-hidden />
                                Call Us Today
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

