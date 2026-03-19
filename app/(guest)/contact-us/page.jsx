import { ContactUsHero } from "@/components/guest/Contact-Us/Contact-Hero";
import { ContactDetailCards } from "@/components/guest/Contact-Us/Contact-Detail-Cards";
import { ContactByDepartment } from "@/components/guest/Contact-Us/Contact-By-Department";
import { ContactFormSection } from "@/components/guest/Contact-Us/Contact-Form-Section";
import { ContactCTA } from "@/components/guest/Contact-Us/Contact-CTA";

export default function ContactUsPage() {
  return (
    <>
      <ContactUsHero />
      <ContactDetailCards />
      <ContactFormSection />
      <ContactByDepartment />
      
      <ContactCTA />
    </>
  );
}
