"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    side: "left",
    year: "2021",
    title: "Company Founded",
    description:
      "Started with a vision to revolutionize dispatch services",
  },
  {
    side: "right",
    year: "2022",
    title: "100 Drivers",
    description: "Reached our first major milestone of active drivers",
  },
  {
    side: "left",
    year: "2023",
    title: "Technology Platform",
    description: "Launched proprietary dispatch management system",
  },
  {
    side: "right",
    year: "2024",
    title: "National Coverage",
    description: "Expanded operations to all 48 contiguous states",
  },
  {
    side: "left",
    year: "2025",
    title: "500+ Partners",
    description: "Growing network of drivers and shippers",
  },
  {
    side: "right",
    year: "2026",
    title: "Industry Leader",
    description: "Recognized as top-tier dispatch service provider",
  },
];
const CARD_STYLE = {
  background: "var(--card)",
  color: "var(--card-foreground)",
  border: "2px 2px 2px 0 solid var(--border)",
  borderRadius: "0.75rem",
  boxShadow:
    "0 4px 6px 2px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
  padding: "1.25rem 1.5rem",
};

/** Milestone body when the card sits on the left of the line */
export function TimelineMilestoneLeft({ year, title, description }) {
  return (
    <div className="min-h-28 px-0 pt-1 text-center">
      <p className="text-right text-2xl! font-bold! text-secondary sm:text-3xl!">
        {year}
      </p>
      <h3 className="text-right mt-2 text-base font-bold text-foreground sm:text-lg">
        {title}
      </h3>
      <p className="text-right mt-2! text-sm leading-relaxed text-foreground/80">
        {description}
      </p>
    </div>
  );
}

/** Milestone body when the card sits on the right of the line */
export function TimelineMilestoneRight({ year, title, description }) {
  return (
    <div className="min-h-28 px-0 pt-1 text-center">
      <p className="text-left text-2xl! font-bold! text-secondary sm:text-3xl!">
        {year}
      </p>
      <h3 className="text-left mt-2 text-base font-bold text-foreground sm:text-lg">
        {title}
      </h3>
      <p className="text-left mt-2! text-sm leading-relaxed text-foreground/80">
        {description}
      </p>
    </div>
  );
}

export function AboutTimeline() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className={cn(
              "inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary",
              "sm:text-sm"
            )}
          >
            OUR JOURNEY
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Milestones &amp; Growth
          </h2>
        </div>

        <div className="mt-14 sm:mt-16">
          <VerticalTimeline lineColor="#e5e7eb" layout="2-columns">
            {MILESTONES.map((item) => {
              const isLeft = item.side === "left";
              const Body = isLeft ? TimelineMilestoneLeft : TimelineMilestoneRight;
              return (
                <VerticalTimelineElement
                  key={item.year + item.title}
                  position={item.side}
                  contentStyle={CARD_STYLE}
                  iconStyle={{
                    background: "var(--color-primary-dark)",
                    width: "14px",
                    height: "14px",
                    marginLeft: "-7px",
                    marginTop: "12px",
                  }}
                >
                  <Body
                    year={item.year}
                    title={item.title}
                    description={item.description}
                  />
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
        </div>
      </div>
    </section>
  );
}
