"use client";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { LoginProvider } from "./UserContextProvider";
export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push} className="w-full">
      <LoginProvider>{children}</LoginProvider>
    </NextUIProvider>
  );
}
