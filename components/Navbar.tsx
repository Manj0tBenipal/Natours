"use client";

import {
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import LoginForm from "./LoginForm";
import { useContext, useState } from "react";
import { UserContext } from "./providers/UserContextProvider";
export default function NavbarComponent() {
  const [loginFormVisible, setLoginFormVisible] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);
  console.log(Object.keys(user).length)
  return (
    <>
      {loginFormVisible && <LoginForm loginFormVisible={setLoginFormVisible} />}

      <Navbar className="flex min-w-full z-40 shadow-sm">
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
          {/* Check if the user is loggedIn */}
          {Object.keys(user).length===0 ? (
              <>
                {
                  !loginFormVisible && (
                      <NavbarItem>
                        <Button
                            onClick={() => setLoginFormVisible(true)}
                            href="/login"
                            color="primary"
                            variant="bordered"
                        >
                          Login
                        </Button>
                      </NavbarItem>)
                }
                  <NavbarItem>
                  <Button as={Link} href="/signup" color="primary" variant="solid">
                  Signup
                  </Button>
                  </NavbarItem>

              </>

          ) : (
            <NavbarItem>

            </NavbarItem>
          )}

        </NavbarContent>
      </Navbar>
    </>
  );
}
