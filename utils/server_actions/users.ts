"use server";

import { cookies } from "next/headers";
import { addSessionCookieToHeader, env } from "../functions";

/**
 * Sends a request to API to edit a user with the data provided as argument
 *
 * @param user
 * @returns {ServerActionRes}
 */
export async function editUser(user: User): Promise<ServerActionRes> {
  try {
    const headers = new Headers({ "Content-type": "application/JSON" });
    //add session cookie to headers for the API to verify user's priveleges
    addSessionCookieToHeader(cookies(), headers);
    const promise = await fetch(`${env("API_URL")}/users/${user._id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(user),
    });

    const res = await promise.json();
    if (res.status === "error" || res.status === "fail")
      throw new Error(res.err);
    return { status: "success", error: null, data: res.data };
  } catch (err: any) {
    return { error: err.message, data: null, status: "fail" };
  }
}
