"use server";

import { revalidatePath } from "next/cache";
/**
 * This function revalidated a specific path if there is a need to initiate 
 * a revalidate request from client side since revalidation can only be triggered from server 
 */
export async function revalidate(path: string) {
  return revalidatePath(path);
}
