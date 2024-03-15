"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addSessionCookieToHeader } from "../functions";

/**
 * This function is used to post a review to the database
 * @param data
 * @returns {ServerActionRes}
 */
export async function postReview(data: string): Promise<ServerActionRes> {
  try {
    //destructuring ensures that only required data in passed to the API
    const review: Review = JSON.parse(data);
    const headers = new Headers({ "Content-type": "application/JSON" });
    addSessionCookieToHeader(cookies(), headers);
    //send a post reuqest to post a new review
    const promise = await fetch(
      `${process.env.API_URL}/tours/${review.tourId}/reviews`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(review),
      }
    );

    const res = await promise.json();
    if (res.status === "fail" || res.status === "error")
      throw new Error(res.err);
    revalidatePath(`/tours/${review.tourId}`);
    revalidatePath(`/api/reviews/${review.tourId}`);
    return { status: "success", data: null, error: null };
  } catch (err: any) {
    return { status: "fail", data: null, error: err.message };
  }
}

export async function deleteReview(reviewId: string): Promise<ServerActionRes> {
  try {
    const headers = new Headers();
    addSessionCookieToHeader(cookies(), headers);
    const promise = await fetch(`${process.env.API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: headers,
    });
    const res = await promise.json();

    if (res.status === "fail" || res.status === "success")
      throw new Error(res.err);
    return { status: "success", data: res.data, error: null };
  } catch (err: any) {
    console.log(err.message);
    return { error: err.message, data: null, status: "fail" };
  }
}
