"use client";
import { login } from "@/utils/serverActions";
import isEmail from "validator/lib/isEmail";
import { Button, Input } from "@nextui-org/react";
import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { FaCross, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdCancel, MdEmail } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "./providers/UserContextProvider";
interface User {
  email: string;
  password: string;
}
export default function LoginForm({
  loginFormVisible,
}: {
  loginFormVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [user, setUser] = useState<User>({ email: "", password: "" } as User);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  /**
   * This function sets the user object using the onChange event and assigns the
   * values to name and password from the inout elements
   * @param e
   */
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev: User) => ({ ...prev, [name]: value }) as User);
  };

  //toggles the visiblity of password
  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const validateUser = (user: User) => {
    setValidated(
      () =>
        user.password.length >= 12 &&
        user.password.length <= 20 &&
        isEmail(user.email)
    );
  };
  /*
   * Call the server action to login using the auth API
  clear the from
   *
   */
  const handleLogin = async () => {
    try {
      const data = await login(JSON.stringify(user));
      user.password = "";
      user.email = "";
    } catch (err) {}
  };
  //validate user on every change in email or password
  useEffect(() => {
    validateUser(user);
  }, [user]);

  return (
    <div className="sticky top-0 w-full h-svh z-50 bg-white flex items-center justify-center">
      <MdCancel
        className="cursor-pointer absolute top-2 left-2"
        size={32}
        onClick={() => loginFormVisible(false)}
      />
      <div className="flex flex-col p-4 gap-4 items-center justify-center">
        <Input
          onChange={(e) => handleInput(e)}
          value={user.email}
          type="email"
          name="email"
          label="Email"
          variant="bordered"
          placeholder="you@example.com"
          labelPlacement="inside"
          endContent={
            <MdEmail className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Input
          label="Password"
          name="password"
          onChange={handleInput}
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        <Button
          //check if the data inside user object passes validation
          isDisabled={!validated}
          color="primary"
          variant="solid"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
