"use server";

import { cookies } from "next/headers";
import { addSessionCookieToHeader } from "../functions";
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
      name: "session",
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
 *This function is used to authenticate the user using the cookie that contains JWT
 * It acts as a middleware between client's request for authentication to the server and
 * server's request to the API to authenticate user
 * The cookie is retrieved from the client's request and is sent to the API in request headers
 * @returns {Promise<ServerActionRes>}
 */
export async function authUsingCookie(): Promise<ServerActionRes> {
  try {
    const headers = new Headers({ "Content-type": "application/JSON" });
    addSessionCookieToHeader(cookies(), headers);
    const res = await fetch(`${process.env.API_URL}/users/auth-using-cookie`, {
      headers: headers,
    });
    if (res.status !== 200) throw new Error("User is not logged in");
    const { user } = await res.json();
    if (!user) throw new Error("User not logged in");
    return { status: "success", data: { user }, error: null };
  } catch (err: any) {
    return { status: "fail", data: null, error: err.message };
  }
}

/**
 * This function signs up user using the API and creates a new session cookie using the token
 * returned by the API
 * @param userData
 * @returns {Promise<ServerActionRes>}
 */
export async function signup(userData: string): Promise<ServerActionRes> {
  try {
    const { name, email, password } = JSON.parse(userData);

    //Check if the server action recieved sufficient data;
    if (!email || !password || !name) throw new Error("Insufficient data");

    //make an api call to signup the user
    const resPromise = await fetch(`${process.env.API_URL}/users/signup`, {
      method: "POST",
      body: userData,
      headers: {
        "Content-type": "application/JSON",
      },
    });
    const res = await resPromise.json();
    if (res.status === "fail" || res.status === "error")
      throw new Error(res.err);

    //token contains the jwt which will be added to the cookie
    const { token, data } = res;
    cookies().set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
    });
    //data contains the user object containing user's name, email and photo
    return { status: "success", data, error: null };
  } catch (err: any) {
    return { error: err.message, data: null, status: "fail" };
  }
}
/**
 *This function deletes the cookie that is used to authenticate user
 */
export async function logout() {
  cookies().delete("session");
}
