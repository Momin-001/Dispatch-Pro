import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_DATA = [
  {
    key: "drivers",
    icon: HelpCircle,
    title: "For Drivers",
    items: [
      {
        q: "What are the requirements to join DispatchPro as a driver?",
        a: "You’ll need a valid Class A CDL, a clean driving record, and verifiable experience. Exact requirements can vary by lane and equipment type.",
      },
      {
        q: "How quickly will I get my first load assignment?",
        a: "Most approved drivers receive load options within 24–48 hours depending on market demand, equipment type, and your preferred lanes.",
      },
      {
        q: "What percentage does DispatchPro take from my earnings?",
        a: "Our fee depends on the service package and load type. You’ll always see the rate and any fees upfront before accepting a load.",
      },
      {
        q: "Can I choose my own routes and loads?",
        a: "Yes. You can set your preferred lanes, home time, and equipment preferences, and accept only the loads that work for you.",
      },
    ],
  },
  {
    key: "owner-operators",
    icon: HelpCircle,
    title: "For Owner-Operators",
    items: [
      {
        q: "What equipment types does DispatchPro support?",
        a: "We support common equipment types including dry van, reefer, flatbed, and more. Availability may vary by region and season.",
      },
      {
        q: "Do I need to provide my own insurance and authority?",
        a: "Typically yes. Owner-operators are expected to maintain active authority and insurance coverage. We’ll confirm specifics during onboarding.",
      },
      {
        q: "How does payment work? When will I get paid?",
        a: "Payment timelines depend on the broker/shipper terms and documentation submission. Quick pay options may be available for qualifying loads.",
      },
      {
        q: "Can I work with other dispatchers while using your service?",
        a: "That depends on your agreement and how your dispatch setup is managed. We can discuss flexible options during your application.",
      },
    ],
  },
  {
    key: "shippers",
    icon: HelpCircle,
    title: "For Shippers",
    items: [
      {
        q: "What types of freight do you handle?",
        a: "We handle a wide range of freight across FTL, LTL, and specialized services. Tell us your freight details and we’ll suggest the best option.",
      },
      {
        q: "How do you ensure driver quality and reliability?",
        a: "We work with vetted carriers and drivers, verify compliance, and proactively monitor shipment progress and communication.",
      },
      {
        q: "What is your coverage area?",
        a: "We provide nationwide coverage with lane-dependent capacity. For consistent volume, we can set up dedicated lanes and routing.",
      },
      {
        q: "How do you handle claims for damaged or lost freight?",
        a: "We assist with documentation and communication throughout the claims process and coordinate with the carrier and insurer as needed.",
      },
    ],
  },
  {
    key: "billing",
    icon: HelpCircle,
    title: "Billing & Payments",
    items: [
      {
        q: "What payment methods do you accept from shippers?",
        a: "We accept standard business payment methods. Payment options may vary depending on contract terms and volume.",
      },
      {
        q: "Are there any hidden fees I should know about?",
        a: "No. We aim for transparent pricing—any accessorials or service fees are disclosed upfront.",
      },
      {
        q: "Do you offer fuel advance programs for drivers?",
        a: "Fuel advance availability depends on the load and carrier terms. We’ll guide you through eligible options when booking.",
      },
    ],
  },
  {
    key:"Technology & Support",
    icon: HelpCircle,
    title: "Technology & Support",
    items: [
      {
        q: "What technology platforms do you use?",
        a: "We use a combination of technology and human support to manage your shipments. We use a combination of technology and human support to manage your shipments.",
      },
      {
        q: "Is your dispatch team available 24/7?",
        a: "Yes, our dispatch team is available 24/7 to help you with any questions or issues you may have.",
      },
      {
        q: "Do you provide training on your systems?",
        a: "Yes, we provide training on our systems to help you get the most out of our service.",
      },
    ],
  },
];

export function FAQSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {FAQ_DATA.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.key}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-dark text-background">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {group.title}
                  </h2>
                </div>

                <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                  <Accordion type="single" collapsible>
                    {group.items.map((item, idx) => (
                      <AccordionItem
                        key={item.q}
                        value={`${group.key}-${idx}`}
                        className="border-border"
                      >
                        <AccordionTrigger className="px-3 py-4 sm:px-4">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-4 text-muted-foreground sm:px-4">
                          <p>{item.a}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

