"use client";

import { UserContext } from "@/components/providers/UserContextProvider";
import { useContext, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import UserTable from "@/components/ui/UserTable";

export default function Dasboard() {
  const { user } = useContext(UserContext);
  const [selectedCollection, setSelectedCollection] = useState("users");
  if (Object.keys(user).length === 0)
    return <h1>Please log in to access this route.</h1>;
  if (user?.role !== "admin")
    return <h1>Your are not allowed to access this route.</h1>;
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-start">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="solid" color="primary" className="font-bold">
              {selectedCollection.toUpperCase()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Action event example"
            onAction={(key) => setSelectedCollection(key.toString())}
          >
            <DropdownItem key="users">Users</DropdownItem>
            <DropdownItem key="tours">Tours</DropdownItem>
            <DropdownItem key="bookings">Bookings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <UserTable />
    </div>
  );
}
