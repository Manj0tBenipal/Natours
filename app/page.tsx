import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="w-full p-16">
      <Hero />
      <ContentSection />
      <Footer />
    </main>
  );
}
