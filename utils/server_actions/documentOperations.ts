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
 * Fetches documents from a specified collection with optional filters and fields.
 * @param {string} collection - The name of the collection from which to fetch documents.
 * @param {Filters} filters - An object containing filters for the query, including 'limit' and 'page'.
 * @param {string[]} [fields] - An optional array of field names to include in the response.
 * @returns {Promise<ServerActionRes>} A Promise that resolves with the server response containing the fetched documents.
 */
export async function getDocs(
  collection: "tours" | "users",
  filters: Filters,
  fields?: string[]
): Promise<ServerActionRes> {
  try {
    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);

    //costruct a new queryString based on the filters and fields
    const queryString = `?limit=${filters.limit}&page=${filters.page}${fields ? "&fields=" + fields.join(",") : ""}`;
    const promise = await fetch(
      `${process.env.API_URL}/${collection.toLowerCase()}${queryString}`,
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
export async function deleteDoc(
  collection: collection,
  docId: string
): Promise<ServerActionRes> {
  try {
    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);
    const promise = await fetch(`${env("API_URL")}/${collection}/${docId}`, {
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
