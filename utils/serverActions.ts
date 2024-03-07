"use server";

import { cookies } from "next/headers";
/**
 *
 * @param credentials email and password of user
 * @returns data
 */
export async function login(credentials: string): Promise<ServerActionRes> {
  try {
    const res = await fetch(`${process.env.API_URL}/users/login`, {
      method: "POST",
      body: credentials,
      headers: { "Content-type": "application/JSON" },
    });
    const statusCode = res.status;

    if (statusCode === 401) throw new Error("Invalid Credentials");

    if (statusCode !== 200) throw new Error("Something went wrong!");

    const { data, token } = await res.json();

    if (!data && !token) throw new Error("Something went wrong!");

    cookies().set({
      name: "refreshToken",
      value: token,
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
    });

    return { status: "success", error: null, data };
  } catch (err) {
    return { status: "fail", error: "somehting went wrong", data: null };
  }
}

/**
 *This function
 * @returns {Promse<ServerActionRes>}
 */
export async function authUsingCookie(): Promise<ServerActionRes> {
  try {
    const res = await fetch(`${process.env.API_URL}/users/auth-using-cookie`);
    if (res.status !== 200) throw new Error("User is not logged in");
    const { user } = (await res.json()).data;
    if (!user) throw new Error("User not logged in");
    return { status: "success", data: { user }, error: null };
  } catch (err: any) {
    return { status: "fail", data: null, error: err.message };
  }
}
