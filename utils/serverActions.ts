"use server";

import { cookies } from "next/headers";
/**
 *
 * @param credentials email and password of user
 * @returns data
 */
export async function login(credentials: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.API_URL}/users/login`, {
      method: "POST",
      body: credentials,
      headers: { "Content-type": "application/JSON" },
    });
    const statusCode = res.status;
    if (statusCode !== 200) {
      return JSON.stringify({ error: "Invalid Credentials" });
    }
    const { data, token } = await res.json();
    if (!data && !token)
      return JSON.stringify({ error: "Something went wrong please try later" });
    cookies().set({
      name: "refreshToken",
      value: token,
      httpOnly: true,
      secure: true,
    });
    return JSON.stringify(data);
  } catch (err) {
    return JSON.stringify({ error: "Something went wrong please try later" });
  }
}

export async function authUsingCookie(): Promise<string> {
  try {
    const res = await fetch(`${process.env.API_URL}/users/auth-using-cookie`);
    if (res.status !== 200) throw new Error("User is not logged in");
    const { user } = (await res.json()).data;
    return JSON.stringify(user);
  } catch (err: any) {
    return JSON.stringify({ status: "fail", data: null, error: err.message });
  }
}
