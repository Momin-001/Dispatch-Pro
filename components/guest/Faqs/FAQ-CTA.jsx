import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FAQCTA() {
  return (
    <section className="bg-primary-dark/95 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <MessageCircle className="size-14 text-background/90" aria-hidden />

          <h2 className="mt-5 text-3xl font-bold leading-tight text-background sm:text-4xl">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-base text-background/80 sm:text-lg">
            Our support team is available 24/7 to help you with any
            questions or concerns
          </p>

          <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
              <Link href="tel:+15551234567">Call (555) 123-4567</Link>
            </Button>
            <Button
              variant="destructive"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

