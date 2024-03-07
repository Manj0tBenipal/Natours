"use client";
import { useContext } from "react";
import { UserContext } from "@/components/providers/UserContextProvider";
import { User } from "@nextui-org/react";
export default function UserAvatar() {
  const { user, setUser } = useContext(UserContext);

  if (Object.keys(user).length === 0) return null;
  return (
    <User
      name={user.name}
      description={user.email}
      avatarProps={{
        src: user.photo,
        className: "w-10 h-10",
      }}
    />
  );
}
