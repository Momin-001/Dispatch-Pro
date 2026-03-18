import { RoleDetailHero } from "@/components/guest/Combine/Role-Detail-Hero";
import { RoleDetailStatCards } from "@/components/guest/Combine/Role-Detail-Stat-Cards";
import { RoleWhyChoose } from "@/components/guest/Combine/Role-Why-Choose";
import { RoleSplitFeaturesCta } from "@/components/guest/Combine/Role-Split-Features-Cta";
import { RoleTestimonials } from "@/components/guest/Combine/Role-Testimonials";
import { RoleSplitRequirementsTraining } from "@/components/guest/Combine/Role-Split-Requirements-Training";
import { RoleApplicationSection } from "@/components/guest/Combine/Role-Application-Section";
import { ShipperApplicationForm } from "@/components/guest/Shippers/Shipper-Application-Form";
import { ShipperServicesSection } from "@/components/guest/Combine/Shipper-Services-Section";

const pageData = {
  "hero": {
    "badge": {
      "text": "FOR SHIPPERS AND LOGISTICS MANAGERS",
      "icon": "User"
    },
    "title": {
      "line1": "Ship Smarter with",
      "line2": "Complete Visibility",
      "line3": "& Control",
    },
    "description": "Partner with a trusted logistics provider offering real-time tracking, competitive rates, and dedicated support for your freight needs.",
    "cta": {
      "label": "Request a Quote",
      "href": "/signup"
    },
    "aside": {
      "text": "Free Consultation Included",
      "icon": "CircleCheckBig"
    },
    "backgroundImage": "/role-hero-shipper.jpg"
  },

  "statCards": [
    { "value": "98%", "label": "On-Time Delivery" },
    { "value": "24/7", "label": "Shipment Tracking" },
    { "value": "$5M+", "label": "Cargo Insurance" },
    { "value": "15min", "label": "Average Response" }
  ],

  "whyChoose": {
    "title": "Why Shippers Trust Us",
    "description":
      "We combine competitive pricing with exceptional service and complete transparency for your peace of mind.",
    "cards": [
      {
        "icon": "Eye",
        "title": "Real-Time Visibility",
        "description":
          "Track every shipment in real-time with GPS tracking, automated updates, and instant notifications when something changes.",
        "points": [
          "Live GPS tracking on all loads",
          "Automated ETA updates",
          "Instant delay notifications"
        ]
      },
      {
        "icon": "DollarSign",
        "title": "Competitive Pricing",
        "description":
          "Get transparent, competitive rates with no hidden fees. Volume discounts available for regular shippers.",
        "points": [
          "Transparent pricing structure",
          "Volume-based discounts",
          "No surprise accessorial charges"
        ]
      },
      {
        "icon": "Shield",
        "title": "Comprehensive Protection",
        "description":
          "Every shipment is covered by $5M cargo insurance. Your freight is protected from pickup to delivery.",
        "points": [
          "$5M cargo insurance included",
          "Vetted carrier network",
          "Claims support team"
        ]
      }
    ]
  },

  "splitFeaturesCta": {
    "title": "Everything You Need in One Platform",
    "description":
      "Our shipper portal gives you complete control over your freight with intuitive tools and instant access to documents.",
    "features": [
      {
        "icon": "MapPin",
        "title": "Shipment Tracking",
        "description":
          "Monitor all your active shipments on a single dashboard with live map views and ETAs."
      },
      {
        "icon": "FileText",
        "title": "Document Management",
        "description":
          "Access BOLs, PODs, invoices, and shipping documents instantly from your portal."
      },
      {
        "icon": "ChartColumn",
        "title": "Analytics & Reporting",
        "description":
          "Generate shipping reports, analyze costs, and optimize your logistics strategy."
      },
      {
        "icon": "Bell",
        "title": "Smart Notifications",
        "description":
          "Get alerts for pickups, deliveries, delays, and important shipment events."
      }
    ],
    "ctaBox": {
      "title": "Free Consultation & Quote",
      "description":
        "Get started with a free shipping analysis and customized quote based on your specific needs.",
      "points": [
        "Free shipping route analysis",
        "Custom pricing proposal",
        "No obligation or commitment",
        "Volume discount evaluation",
        "Portal demo and training"
      ],
      "button": {
        "label": "Request Free Quote",
        "href": "/signup"
      }
    }
  },

  "shippingServices": {
    "title": "Comprehensive Shipping Services",
    "description":
      "We handle all types of freight with specialized services for your industry",
    "services": [
      {
        "icon": "Truck",
        "title": "Full Truckload (FTL)",
        "description":
          "Dedicated trucks for your full loads with expedited service and competitive rates.",
        "points": [
          "Dry van, reefer, flatbed options",
          "Coast-to-coast coverage",
          "Expedited shipping available"
        ]
      },
      {
        "icon": "Package",
        "title": "Less Than Truckload (LTL)",
        "description":
          "Cost-effective shipping for smaller loads with reliable delivery times.",
        "points": [
          "Consolidated shipping to save costs",
          "Flexible pickup and delivery",
          "Liftgate and inside delivery options"
        ]
      },
      {
        "icon": "Timer",
        "title": "Expedited Shipping",
        "description":
          "Time-critical freight delivered fast with team drivers and hot shot services.",
        "points": [
          "Same-day and next-day options",
          "Team driver services",
          "White glove handling available"
        ]
      },
      {
        "icon": "Target",
        "title": "Dedicated Lanes",
        "description":
          "Recurring shipments on your regular lanes with consistent pricing and priority service.",
        "points": [
          "Volume-based pricing discounts",
          "Guaranteed capacity",
          "Dedicated account manager"
        ]
      }
    ]
  },

  "testimonials": {
    "title": "What Our Shippers Say",
    "description": "Trusted by businesses of all sizes across multiple industries",
    "items": [
      {
        "quote":
          "Switched to DispatchPro 6 months ago and haven't looked back. Real-time tracking and responsive support make our logistics planning so much easier. Highly recommend!",
        "name": "Robert Chang",
        "roleLine": "Supply Chain Director, TechCorp"
      },
      {
        "quote":
          "Their pricing is competitive and transparent. No surprise charges at the end. The portal makes it easy to track shipments and download documents instantly.",
        "name": "Jennifer Brooks",
        "roleLine": "Logistics Manager, BuildRight Inc"
      },
      {
        "quote":
          "Outstanding service! We ship 50+ loads per month and their team handles everything smoothly. The dedicated account manager knows our business inside and out.",
        "name": "Michael Patterson",
        "roleLine": "Operations VP, FreshFoods Co"
      }
    ]
  },
  
  "requirementsTraining": {
    "title": "Your Trusted Logistics Partner",
    "description":
      "We've built our reputation on reliability, transparency, and exceptional service.",
    "features": [
      {
        "title": "Carrier Network Vetting",
        "description": "All carriers undergo rigorous screening for safety, insurance, and reliability"
      },
      {
        "title": "Dedicated Account Management",
        "description": "High-volume shippers get a dedicated account manager who knows your business"
      },
      {
        "title": "Proactive Communication",
        "description": "We keep you informed with automated updates and quick responses to inquiries"
      },
      {
        "title": "Industry Compliance",
        "description": "Full FMCSA compliance and proper licensing for worry-free shipping"
      },
      {
        "title": "Flexible Payment Terms",
        "description": "Net 30 terms available for approved customers"
      }
    ],
    "ctaBox": {
      "title": "Enterprise Solutions Available",
      "description":
        "For high-volume shippers, we offer customized enterprise solutions with dedicated resources.",
      "innerTitle": "Enterprise Features Include:",
      "points": [
        "Custom pricing agreements",
        "Dedicated dispatch team",
        "Priority capacity guarantees",
        "API integration with your TMS",
        "Custom reporting and analytics",
        "Quarterly business reviews"
      ],
      "button": {
        "label": "Contact Sales Team",
        "href": "/signup"
      }
    }
  },

  "applicationSectionData" : {
    badge: { 
    text: "START SHIPPING SMARTER TODAY" },
    title: "Get a Custom Quote in 24 Hours or Less",
    description:
      "Experience reliable freight solutions with transparent pricing, real-time tracking, and dedicated support.",
    features: [
      {
        title: "Free Shipping Analysis",
        description: "No cost route optimization and pricing proposal",
      },
      {
        title: "No Obligation",
        description: "Review our proposal with zero commitment required",
      },
      {
        title: "Volume Discounts",
        description: "Special pricing for high-volume shippers",
      },
    ],
    contactBox: {
      heading: "Need Immediate Assistance?",
      phone: "(555) 123-4567",
      hours: "Available 24/7 for quote requests",
    },
    applicationFormButton: {
      label: "Request Free Quote",
    },
  }
}


export default function ShippersPage() {
  return (
    <div>
      <RoleDetailHero data={pageData.hero} />
      <RoleDetailStatCards data={pageData.statCards} />
      <RoleWhyChoose data={pageData.whyChoose} />
      <ShipperServicesSection data={pageData.shippingServices} />
      <RoleSplitFeaturesCta data={pageData.splitFeaturesCta} />
      <RoleTestimonials data={pageData.testimonials} />
      <RoleSplitRequirementsTraining data={pageData.requirementsTraining} />
      <RoleApplicationSection data={pageData.applicationSectionData}>
        <ShipperApplicationForm data={pageData.applicationSectionData.applicationFormButton} />
      </RoleApplicationSection>
    </div>
  );
}
