"use client";

import { UserContext } from "@/components/providers/UserContextProvider";
import { ReactNode, useContext } from "react";

/**
 * This function is used as a layout for all routes inside /dashboard
 * These are protected routes and are only accessible to admin.
 * This layout checks for the logged in user and only allows access to the logged-in
 * user with 'admin' role.
 *
 */
export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useContext(UserContext);
  //if user is not logged in, restrict the access
  if (Object.keys(user).length === 0)
    return <h1>Please log in to access this route.</h1>;

  //if user is not admin restrict the access
  if (user?.role !== "admin")
    return <h1>Your are not allowed to access this route.</h1>;

  return <>{children}</>;
}
