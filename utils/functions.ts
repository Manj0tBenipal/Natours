import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
/**
 * This function retrieves session cookie from cookies and
 * addes it in the headers of request options
 * @param cookieObject
 * @param requestOptions
 */
export function addSessionCookieToHeader(
  cookieObject: ReadonlyRequestCookies,
  headers: Headers
): void {
  if (!cookieObject.has("session")) throw new Error("User is not Loggde in!");
  const sessionCookie = cookieObject.get("session");
  if (!sessionCookie?.value)
    throw new Error("Cookie is Invalid! Please log in again.");

  headers.set("Authorization", `Bearer ${sessionCookie.value}`);
}
