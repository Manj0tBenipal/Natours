"use client";

import { ChangeEvent, useCallback, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { editDoc } from "@/utils/server_actions/documentOperations";
import { FaSpinner } from "react-icons/fa";
import Dropone from "../Dropone";
const dynamic = "force-dynamic";
export default function EditUser({ user }: { user: User }) {
  const router = useRouter();
  const [userData, setUserData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const roles = ["customer", "admin", "lead-guide", "guide"];

  const handleSave = useCallback(
    async (user: User) => {
      try {
        setIsSaving(true);
        const res = await editDoc("users", user);
        if (res.status === "fail") throw new Error(res?.error || "");
        alert("Data saved Successfully");
        router.back();
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsSaving(false);
      }
    },
    [router]
  );
  return (
    <div
      className="flex flex-col gap-y-3 p-4 bg-white shadow-md rounded-2xl
     items-center m-auto"
    >
      <Input
        type="email"
        label="Email"
        name="email"
        value={userData.email}
        onChange={handleInput}
      />
      <Input
        type="text"
        label="Name"
        name="name"
        value={userData.name}
        onChange={handleInput}
      />
      <Select
        name="role"
        label="Select role"
        defaultSelectedKeys={[userData.role]}
        onChange={handleInput}
      >
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role.toUpperCase()}
          </SelectItem>
        ))}
      </Select>
      <Dropone
        setUrl={(url: string) => {
          setUserData((prev) => ({ ...prev, photo: url }));
        }}
      />
      <div className="flex gap-x-3 w-full items-center ">
        <Chip
          className="text-white"
          color={userData.active ? "success" : "danger"}
        >
          {userData.active ? "Active" : "Inactive"}
        </Chip>
        <Switch
          isSelected={userData.active}
          onValueChange={(value) =>
            setUserData((prev) => ({ ...prev, active: value }))
          }
        />
      </div>

      <div className="flex gap-x-3 items-center w-full ">
        <Button
          isLoading={isSaving}
          color="success"
          className="font-bold text-white"
          onClick={() => handleSave(userData)}
          spinner={<FaSpinner className="animate-spin" />}
        >
          Save Changes
        </Button>
        <Button
          color="danger"
          className="font-bold"
          onClick={() => router.back()}
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
