import { RoleDetailHero } from "@/components/guest/Combine/Role-Detail-Hero";
import { RoleDetailStatCards } from "@/components/guest/Combine/Role-Detail-Stat-Cards";
import { RoleWhyChoose } from "@/components/guest/Combine/Role-Why-Choose";
import { RoleSplitFeaturesCta } from "@/components/guest/Combine/Role-Split-Features-Cta";
import { RoleTestimonials } from "@/components/guest/Combine/Role-Testimonials";
import { RoleSplitRequirementsTraining } from "@/components/guest/Combine/Role-Split-Requirements-Training";
import { RoleApplicationSection } from "@/components/guest/Combine/Role-Application-Section";
import { DispatcherApplicationForm } from "@/components/guest/Dispatchers/Dispatcher-Application-Form";

const pageData = {
    "hero": {
      "badge": {
        "text": "FOR PROFESSIONAL DISPATCHERS",
        "icon": "BriefcaseBusiness"
      },
      "title": {
        "line1": "Power Your Dispatch",
        "line2": "Career with",
        "line3": "Cutting-Edge Tools",
      },
      "description": "Join a team that values your expertise. Manage loads efficiently with our advanced dispatch platform, competitive compensation, and work-life balance.",
      "cta": {
        "label": "Apply as Dispatcher",
        "href": "/signup"
      },
      "aside": {
        "text": "Remote & Hybrid Options",
        "icon": "CircleCheckBig"
      },
      "backgroundImage": "/role-hero-dispatcher.jpg"
    },

    "statCards": [
      { "value": "$55k+", "label": "Average Salary" },
      { "value": "Remote", "label": "Work Options" },
      { "value": "24/7", "label": "Flexible Shifts" },
      { "value": "Full", "label": "Benefits Package" }
    ],

    "whyChoose": {
      "title": "Why Dispatchers Choose Us",
      "description":
        "Work with cutting-edge technology, supportive management, and competitive compensation in a growing industry.",
      "cards": [
        {
          "icon": "Smartphone",
          "title": "Modern Technology",
          "description":
            "Use our state-of-the-art dispatch management system with real-time tracking, automated notifications, and AI-powered load matching.",
          "points": [
            "Cloud-based platform accessible anywhere",
            "Integrated communication tools",
            "Automated load board postings"
          ]
        },
        {
          "icon": "DollarSign",
          "title": "Competitive Compensation",
          "description":
            "Earn $55k-$75k annually with performance bonuses, health benefits, 401(k) matching, and paid time off.",
          "points": [
            "Quarterly performance bonuses",
            "Comprehensive health insurance",
            "401(k) with company match"
          ]
        },
        {
          "icon": "Clock",
          "title": "Work-Life Balance",
          "description":
            "Choose from flexible scheduling options including day shifts, night shifts, or hybrid remote work arrangements.",
          "points": [
            "Remote work opportunities",
            "Flexible shift scheduling",
            "15+ days PTO per year"
          ]
        }
      ]
    },

    "splitFeaturesCta": {
      "title": "Tools Built for Efficiency",
      "description":
        "Our dispatch platform gives you everything you need to manage loads, communicate with drivers, and track shipments in real-time.",
      "features": [
        {
          "icon": "Users",
          "title": "Driver Management",
          "description":
            "Monitor driver availability, hours of service, and performance metrics from one dashboard."
        },
        {
          "icon": "MapPin",
          "title": "Live Tracking",
          "description":
            "Track all shipments in real-time with GPS integration and automated ETA updates."
        },
        {
          "icon": "ChartColumn",
          "title": "Analytics & Reports",
          "description":
            "Generate detailed performance reports and analytics to optimize operations."
        },
        {
          "icon": "Headphones",
          "title": "Built-in Communication",
          "description":
            "Chat with drivers, shippers, and team members without leaving the platform."
        }
      ],
      "ctaBox": {
        "title": "Career Growth Opportunities",
        "description":
          "We invest in our dispatchers with training, certifications, and clear paths to advancement.",
        "points": [
          "Paid training and onboarding (2 weeks)",
          "Industry certification programs",
          "Promotion opportunities to senior roles",
          "Continuing education support",
          "Mentorship programs"
        ],
        "button": {
          "label": "Apply Now",
          "href": "/signup"
        }
      }
    },

    "testimonials": {
      "title": "What Our Dispatchers Say",
      "description": "Hear from our team about their experience working here",
      "items": [
        {
          "quote":
            "Best dispatch job I've had. The software is intuitive, management is supportive, and I finally have work-life balance. I can work remotely 3 days a week!",
          "name": "Lisa Martinez",
          "roleLine": "Lead Dispatcher, 4 years"
        },
        {
          "quote":
            "The technology here is years ahead of my previous company. Real-time tracking and automated notifications make my job so much easier. Plus, the pay is great!",
          "name": "Jason Chen",
          "roleLine": "Senior Dispatcher, 6 years"
        },
        {
          "quote":
            "I started as an entry-level dispatcher and got promoted to team lead in 18 months. They invest in training and actually promote from within. Love this company!",
          "name": "Amanda Williams",
          "roleLine": "Dispatch Team Lead, 2 years"
        }
      ]
    },

    "requirementsTraining": {
      "title": "What We're Looking For",
      "description":
        "We hire both experienced dispatchers and train motivated candidates who want to enter the industry.",
      "features": [
        {
          "title": "Strong Communication Skills",
          "description": "Clear, professional communication with drivers and clients"
        },
        {
          "title": "Problem-Solving Ability",
          "description": "Quick thinking to handle scheduling changes and issues"
        },
        {
          "title": "Computer Proficiency",
          "description": "Comfortable learning new software systems"
        },
        {
          "title": "Organizational Skills",
          "description": "Ability to manage multiple loads and priorities"
        },
        {
          "title": "Preferred: 1+ Years Experience",
          "description": "Dispatch or logistics experience is a plus but not required"
        }
      ],
      "ctaBox": {
        "title": "Full Benefits Package",
        "description":
          "We take care of our team with comprehensive benefits from day one.",
        "innerTitle": "Benefits Include:",
        "points": [
          "Health, dental, and vision insurance",
          "401(k) retirement plan with matching",
          "15 days PTO + 7 paid holidays",
          "Paid training and certifications",
          "Performance bonuses quarterly",
          "Remote work options available"
        ],
        "button": {
          "label": "View Open Positions",
          "href": "/signup"
        }
      }
    },

    "applicationSectionData" : {
      badge: { 
      text: "JOIN OUR DISPATCH TEAM" },
      title: "Launch Your Dispatcher Career With Us ",
      description:
        "Work with a professional team, manage quality drivers, and grow your career in a supportive environment.",
      features: [
        {
          title: "Competitive Compensation",
          description: "Base salary plus performance bonuses",
        },
        {
          title: "Modern Technology",
          description: "Work with cutting-edge dispatch software",
        },
        {
          title: "Career Growth",
          description: "Opportunities for advancement and leadership roles",
        },
      ],
      contactBox: {
        heading: "Have Questions? Reach Out!",
        phone: "(555) 123-4567",
        hours: "Monday - Friday: 8AM - 6PM EST",
      },
      applicationFormButton: {
        label: "Submit Application",
      },
    }
  }

export default function DispatchersPage() {
    return (
      <div>
        <RoleDetailHero data={pageData.hero} />
        <RoleDetailStatCards data={pageData.statCards} />
        <RoleWhyChoose data={pageData.whyChoose} />
        <RoleSplitFeaturesCta data={pageData.splitFeaturesCta} />
        <RoleTestimonials data={pageData.testimonials} />
        <RoleSplitRequirementsTraining data={pageData.requirementsTraining} />
        <RoleApplicationSection data={pageData.applicationSectionData}>
          <DispatcherApplicationForm data={pageData.applicationSectionData.applicationFormButton} />
        </RoleApplicationSection>
      </div>
    );
  }