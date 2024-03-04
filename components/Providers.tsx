"use client";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  return <NextUIProvider navigate={router.push} className="w-full">{children}</NextUIProvider>;
}
