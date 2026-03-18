"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogNewsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-primary-dark/95 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-background sm:text-5xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-base text-background/80 sm:text-lg">
            Subscribe to our newsletter and get the latest industry insights
            delivered to your inbox
          </p>

          <form
            className={cn("mt-10 flex flex-col items-center gap-4 sm:flex-row")}
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed");
              setEmail("");
            }}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-14 bg-background/10 text-background placeholder:text-background/70"
              inputMode="email"
            />
            <Button
              type="submit"
              variant="destructive"
              size="lg"
              className="h-14"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

