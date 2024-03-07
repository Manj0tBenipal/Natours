"use client";
import { login } from "@/utils/serverActions";
import isEmail from "validator/lib/isEmail";
import { Button, Input } from "@nextui-org/react";
import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { MdCancel, MdEmail } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "./providers/UserContextProvider";
interface userData {
  email: string;
  password: string;
}
export default function LoginForm({
  loginFormVisible,
}: {
  loginFormVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState<userData>({
    email: "",
    password: "",
  } as userData);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  /**
   * This function sets the userData object using the onChange event and assigns the
   * values to name and password from the inout elements
   * @param e
   */
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: userData) => ({ ...prev, [name]: value }) as userData);
  };

  //toggles the visiblity of password
  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const validateuserData = (userData: userData) => {
    setValidated(
      () =>
        userData.password.length >= 12 &&
        userData.password.length <= 20 &&
        isEmail(userData.email)
    );
  };
  /*
   * Call the server action to login using the auth API
  clear the from
   *
   */
  const handleLogin = async () => {
    setButtonLoading(true);
    try {
      const loginPromise = await login(JSON.stringify(userData));
      const data = JSON.parse(loginPromise);

      const { error, user } = data;

      //server actionr returns an object {error:string} in case authentication process fails
      if (error) throw new Error(error);
      if (user) {
        const { name, email } = user;
        //in case of a non-error outcome check if user details are sent
        if (!name || !email) throw new Error("Failed to fetch user");
        //on successfull authentication set the userdata to the context provider
        setUser({ name, email });
        setButtonLoading(false);
        loginFormVisible(false);
      }
    } catch (err: any) {
      alert(err.message);
      setButtonLoading(false);
    }
  };
  //validate userData on every change in email or password
  useEffect(() => {
    validateuserData(userData);
  }, [userData]);

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
          value={userData.email}
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
          //check if the data inside userData object passes validation
          isDisabled={!validated}
          isLoading={buttonLoading}
          color="primary"
          variant="ghost"
          onClick={handleLogin}
          spinner={<FaSpinner />}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
