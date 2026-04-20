"use client";

import { useMemo, useState } from "react";
import { Facebook, Twitter, Linkedin, Mail, Share2, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const SHARE_BG =
  "inline-flex size-8 bg-muted items-center justify-center rounded-full text-[#4A5565] transition-colors hover:brightness-110";

export function ShareButtons({ title = "", className }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
  };

  const openPopup = (url) => {
    if (typeof window === "undefined") return;
    window.open(
      url,
      "share",
      "noopener,noreferrer,width=640,height=560,menubar=no,toolbar=no"
    );
  };

  const handleGenericShare = async () => {
    if (typeof window === "undefined") return;

    // Native share sheet on mobile / supported browsers
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 text-sm text-muted-foreground",
        className
      )}
    >
      <span className="font-bold text-foreground">Share:</span>

      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() => openPopup(links.facebook)}
        className={cn(SHARE_BG)}
      >
        <Facebook className="size-4" />
      </button>

      <button
        type="button"
        aria-label="Share on Twitter / X"
        onClick={() => openPopup(links.twitter)}
        className={cn(SHARE_BG)}
      >
        <Twitter className="size-4" />
      </button>

      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() => openPopup(links.linkedin)}
        className={cn(SHARE_BG)}
      >
        <Linkedin className="size-4" />
      </button>

      <a
        href={links.email}
        aria-label="Share via email"
        className={cn(SHARE_BG)}
      >
        <Mail className="size-4" />
      </a>

      <button
        type="button"
        aria-label={copied ? "Link copied" : "Share or copy link"}
        onClick={handleGenericShare}
        className={cn(SHARE_BG)}
      >
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      </button>
    </div>
  );
}
