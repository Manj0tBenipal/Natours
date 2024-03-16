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

/**
 * Retrieves a list of users from the server based on specified conditions.
 * @param {string} conditions - JSON string representing the conditions for fetching users.
 *                              It should contain 'page' and 'limit' properties.
 * @returns {Promise<ServerActionRes>} A promise that resolves with the server response.
 *                                     The response contains status information and user data.
 */
export async function getUsers(conditions: string): Promise<ServerActionRes> {
  try {
    const { page, limit } = JSON.parse(conditions);

    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);

    const promise = await fetch(
      `${process.env.API_URL}/users?limit=${limit}&page=${page}&fields=role,active,name,email,_id,photo`,
      {
        headers: headers,
      }
    );
    const res = await promise.json();

    if (res.status === "fail" || res.status === "error")
      throw new Error(res.err);
    return { status: "success", error: null, data: res };
  } catch (err: any) {
    return { status: "fail", data: null, error: err.message };
  }
}

/**
 * Deletes a user from the database.
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<ServerActionRes>} A promise that resolves with the server response.
 *
 */
export async function deleteUser(userId: string): Promise<ServerActionRes> {
  try {
    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);
    const promise = await fetch(`${env("API_URL")}/users/${userId}`, {
      method: "DELETE",
      headers,
    });
    const res = await promise.json();
    if (res.status === "error" || res.status === "fail")
      throw new Error(res.err);
    return { data: res.data, status: "success", error: null };
  } catch (err: any) {
    return { error: err.message, data: null, status: "fail" };
  }
}
