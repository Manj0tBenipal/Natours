import { User } from "@nextui-org/react";

export default function Avatar({ user }: { user: User }) {
  return (
    <User
      name={user.name}
      description={user.email}
      avatarProps={{
        src: `/users/${user.photo}`,
        className: "w-10 h-10",
      }}
    ></User>
  );
}
