import { Bebas_Neue } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
  weight: "400",
});
export default function Footer() {
  return (
    <footer className=" bg-transparent p-32 flex flex-col items-center justify-center gap-10 pb-16">
      <div>
        <h1
          className={`${bebasNeue.variable} font-extrabold text-5xl text-gradient`}
        >
          NATOURS Inc.
        </h1>
      </div>
      <div className="flex items-center justify-center gap-10">
        <Link href="https://github.com/Manj0tBenipal/">
          <FaGithub color="var(--color-primary)" size={40} />
        </Link>
        <Link href="https://www.linkedin.com/in/manjot-benipal-01a503293/">
          <FaLinkedin color="var(--color-primary)" size={40} />
        </Link>
        <Link href="https://discord.com/users/m_benipal">
          <FaDiscord color="var(--color-primary)" size={40} />
        </Link>
      </div>
    </footer>
  );
}
