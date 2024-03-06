import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Image from "next/image";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "Natours",
  description:
    "Natours is the platform if you want to explore tours that will provide you once in a lifetime experience. We offer variety and quality at the same time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`relative ${poppins.variable} max-w-screen-2xl m-auto `}>
        <Providers>
          <Navbar />

          <main className="relative min-h-dvh w-full p-16 after:absolute  after:content='' after:top-0 after:left-0 after:-z-10 after:h-full after:w-full after:blur-md after:bg-white after:opacity-70">
            <Image
              className="-z-20 "
              priority
              style={{ top: 0 }}
              src="/bg-gradient2.avif"
              fill
              alt="bg-gradient"
            />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
