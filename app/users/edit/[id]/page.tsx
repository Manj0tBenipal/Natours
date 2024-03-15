import User from "@/components/forms/User";
import { addSessionCookieToHeader, env } from "@/utils/functions";
import { cookies } from "next/headers";
export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);
    const promise = await fetch(`${env("API_URL")}/users/${params.id}`, {
      headers,
    });
    const res = await promise.json();
    if (res.status === "fail" || res.status === "error")
      throw new Error(res.err);
    const { user }: { user: User } = res.data;
    if (!user || Object.keys(user).length === 0)
      throw new Error("Failed to Fetch User. Internal server Error");
    return <User user={user} />;
  } catch (err: any) {
    console.log(err);
    return <div>{err.message}</div>;
  }
}
