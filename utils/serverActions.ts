"use server";

import { cookies } from "next/headers";
/**
 *
 * @param credentials email and password of user
 * @returns data
 */
export async function login(credentials: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/users/login`, {
      method: "POST",
      body: credentials,
      headers: { "Content-type": "application/JSON" },
    });
    const statusCode = res.status;
    if (statusCode !== 200) {
      return { error: "Invalid Credentials" };
    }
    const { data, token } = await res.json();
    if (!data && !token)
      return { error: "Something went wrong please try later" };
    cookies().set({
      name: "refreshToken",
      value: token,
      httpOnly: true,
      secure: true,
    });
    return JSON.stringify(data);
  } catch (err) {
    return { error: "Something went wrong please try later" };
  }
}
