import { Navbar } from "@/components/guest/Navbar";
import { Footer } from "@/components/guest/Footer";

export default function GuestLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}