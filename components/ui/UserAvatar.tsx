"use client";
import { useContext, useState } from "react";
import { UserContext } from "@/components/providers/UserContextProvider";
import { Listbox, ListboxItem, User } from "@nextui-org/react";
import { logout } from "@/utils/server_actions/auth";

import { useRouter } from "next/navigation";
export default function UserAvatar() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [listBoxVisible, setListBoxVisible] = useState<boolean>(false);
  const items = [
    {
      key: "profile",
      label: "Profile",
      link: "/me",
    },
    {
      key: "logout",
      label: "Logout",
    },
  ];

  if (Object.keys(user).length === 0) return null;
  return (
    <div className="relative">
      <User
        className="cursor-pointer"
        name={user.name}
        description={user.email}
        avatarProps={{
          src: `/users/${user.photo}`,
          className: "w-10 h-10",
        }}
        onClick={() => {
          setListBoxVisible((prev) => !prev);
        }}
      ></User>
      {listBoxVisible && (
        <Listbox
          className="absolute bottom-100 bg-white shadow-md rounded-2xl p-1"
          items={items}
          aria-label="Dynamic Actions"
          onAction={async (key) => {
            try {
              if (key === "logout") {
                await logout();
                setUser(() => ({}) as User);
                router.push("/");
              }
            } catch (err) {
              alert("failed to logout");
            }
          }}
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              color={item.key === "logout" ? "danger" : "default"}
              className={item.key === "logout" ? "text-danger" : ""}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      )}
    </div>
  );
}
