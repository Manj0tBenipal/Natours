"use client";

import {
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
export default function NavbarComponent() {
  return (
    <Navbar className=" relative flex min-w-full max-w-2xl shadow-md">
      <NavbarContent justify="start">
        <NavbarItem>
          <Link href="/tours">Tours</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/users">Community</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/about">About us</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="flex justify-end space-x-0">
        <NavbarItem>
          <Button as={Link} href="/login" color="primary" variant="bordered">
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="/signup" color="primary" variant="solid">
            Signup
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
