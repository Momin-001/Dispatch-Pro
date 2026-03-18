import { RoleDetailHero } from "@/components/guest/Combine/Role-Detail-Hero";
import { RoleDetailStatCards } from "@/components/guest/Combine/Role-Detail-Stat-Cards";
import { RoleWhyChoose } from "@/components/guest/Combine/Role-Why-Choose";
import { RoleSplitFeaturesCta } from "@/components/guest/Combine/Role-Split-Features-Cta";
import { RoleTestimonials } from "@/components/guest/Combine/Role-Testimonials";
import { RoleSplitRequirementsTraining } from "@/components/guest/Combine/Role-Split-Requirements-Training";
import { RoleApplicationSection } from "@/components/guest/Combine/Role-Application-Section";
import { DriverApplicationForm } from "@/components/guest/Drivers/Driver-Application-Form";

const pageData = {
  "hero": {
    "badge": {
      "text": "FOR PROFESSIONAL DRIVERS",
      "icon": "Truck"
    },
    "title": {
      "line1": "Drive Your Career",
      "line2": "Forward with",
      "line3": "Top-Paying Loads",
    },
    "description": "Join thousands of professional drivers earning more, getting home faster, and enjoying better working conditions. No forced dispatch. Full transparency. Fair pay every time.",
    "cta": {
      "label": "Start Earning More",
      "href": "/signup"
    },
    "aside": {
      "text": "Average $2.50/mile",
      "icon": "CircleCheckBig"
    },
    "backgroundImage": "/role-hero-driver.jpg"
  },

  "statCards": [
    { "value": "$2.50+", "label": "Average Per Mile" },
    { "value": "$8,500", "label": "Avg Weekly Pay" },
    { "value": "48hrs", "label": "Quick Pay Option" },
    { "value": "100%", "label": "Fuel Card Included" }
  ],
  
  "whyChoose": {
    "title": "Why Professional Drivers Choose Us",
    "description":
      "We put drivers first with competitive pay, flexible schedules, and the support you deserve on the road.",
    "cards": [
      {
        "icon": "DollarSign",
        "title": "Top-Tier Pay Rates",
        "description":
          "Earn $2.50+ per mile on average. No hidden deductions. Weekly direct deposits with optional quick pay in 48 hours.",
        "points": [
          "Detention pay after 2 hours",
          "Layover pay included",
          "Stop-off compensation"
        ]
      },
      {
        "icon": "Home",
        "title": "More Home Time",
        "description":
          "Choose your schedule. We offer regional, dedicated, and OTR options that fit your lifestyle.",
        "points": [
          "Weekend home time options",
          "Regional routes available",
          "No forced dispatch"
        ]
      },
      {
        "icon": "Shield",
        "title": "Full Support & Benefits",
        "description":
          "24/7 dispatch support, fuel cards, pre-pass, and comprehensive insurance coverage.",
        "points": [
          "24/7 dispatch available",
          "Fuel cards & discounts",
          "Full cargo insurance"
        ]
      }
    ]
  },

  "splitFeaturesCta": {
    "title": "Everything You Need on the Road",
    "description":
      "Our mobile app and support systems keep you connected, informed, and in control of your loads.",
    "features": [
      {
        "icon": "Smartphone",
        "title": "Mobile Load Board",
        "description":
          "Accept loads, update status, and communicate with dispatch from your phone."
      },
      {
        "icon": "MapPin",
        "title": "GPS Tracking",
        "description":
          "Real-time tracking keeps you safe and helps optimize your routes."
      },
      {
        "icon": "FileText",
        "title": "Digital Documentation",
        "description":
          "Upload BOLs, sign documents, and manage paperwork digitally."
      },
      {
        "icon": "Fuel",
        "title": "Fuel Optimization",
        "description":
          "Find the best fuel stops and save with our preferred partner discounts."
      }
    ],
    "ctaBox": {
      "title": "Ready to Get Started?",
      "description":
        "Join our network of professional drivers and start earning top rates immediately.",
      "points": [
        "Quick application process (10 minutes)",
        "Approval within 24-48 hours",
        "Start hauling profitable loads immediately",
        "No sign-up or monthly fees"
      ],
      "button": {
        "label": "Apply Now - It's Free",
        "href": "/signup"
      }
    }
  },

  "testimonials": {
    "title": "What Drivers Are Saying",
    "description": "Real stories from professional drivers in our network",
    "items": [
      {
        "quote":
          "Best decision I made for my career. I'm earning 30% more than my previous job and actually get home on weekends. The dispatch team is responsive and respectful.",
        "name": "Michael Johnson",
        "roleLine": "OTR Driver, 12 years exp."
      },
      {
        "quote":
          "The app makes everything so easy. I can see available loads, accept them, and upload my paperwork without calling dispatch. Plus, quick pay is a lifesaver!",
        "name": "Sarah Rodriguez",
        "roleLine": "Regional Driver, 8 years exp."
      },
      {
        "quote":
          "Finally, a company that treats drivers like professionals. Fair rates, transparent pay, and they actually listen to feedback. I've been here 3 years and not leaving.",
        "name": "David Thompson",
        "roleLine": "Dedicated Driver, 15 years exp."
      }
    ]
  },

  "requirementsTraining": {
    "title": "Basic Requirements",
    "description":
      "Make sure you meet these minimum requirements before applying:",
    "features": [
      {
        "title": "Valid Class A CDL",
        "description": "Must be current and in good standing"
      },
      {
        "title": "Clean Driving Record",
        "description": "No major violations in the past 3 years"
      },
      {
        "title": "Minimum 2 Years OTR Experience",
        "description": "Verifiable over-the-road experience preferred"
      },
      {
        "title": "DOT Physical & Medical Card",
        "description": "Valid medical examiner’s certificate"
      },
      {
        "title": "21+ Years of Age",
        "description": "Required for interstate commerce"
      }
    ],
    "ctaBox": {
      "title": "New to the Industry?",
      "description":
        "We also offer training programs for qualified candidates who want to enter the trucking profession.",
      "innerTitle": "Training Program Includes:",
      "points": [
        "CDL preparation and testing support",
        "Behind-the-wheel training with experienced drivers",
        "Safety and compliance certification",
        "Job placement upon completion"
      ],
      "button": {
        "label": "Learn About Training",
        "href": "/signup"
      }
    }
  },
  
  "applicationSectionData" : {
    badge: { text: "START YOUR JOURNEY TODAY" },
    title: "Apply Now & Hit the Road Fast",
    description:
      "Join our network of professional drivers and start earning with consistent loads and fair rates.",
    features: [
      {
        title: "Fast Application Process",
        description: "Get approved and start hauling within 48 hours",
      },
      {
        title: "Consistent Freight",
        description: "Never worry about finding your next load",
      },
      {
        title: "24/7 Dispatch Support",
        description: "Our team is always here when you need us",
      },
    ],
    contactBox: {
      heading: "Questions? Call us!",
      phone: "(555) 123-4567",
      hours: "Monday - Friday: 8AM - 8PM EST",
    },
    applicationFormButton: {
      label: "Submit Application",
    },
  }
};


export default function DriversPage() {
  return (
    <div>
      <RoleDetailHero data={pageData.hero} />
      <RoleDetailStatCards data={pageData.statCards} />
      <RoleWhyChoose data={pageData.whyChoose} />
      <RoleSplitFeaturesCta data={pageData.splitFeaturesCta} />
      <RoleTestimonials data={pageData.testimonials} />
      <RoleSplitRequirementsTraining data={pageData.requirementsTraining} />
      <RoleApplicationSection data={pageData.applicationSectionData}>
        <DriverApplicationForm data={pageData.applicationSectionData.applicationFormButton} />
      </RoleApplicationSection>
    </div>
  );
}
