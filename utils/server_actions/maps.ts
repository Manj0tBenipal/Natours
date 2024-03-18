"use server";

import { env } from "../functions";

/**
 * Fetches location predictions based on user input from the Google Places API.
 * @param location - The input location string provided by the user.
 * @returns A Promise that resolves to a ServerActionRes object containing the fetched data, status, and error (if any).
 */
export async function getLocations(location: string): Promise<ServerActionRes> {
  try {
    //if location is an empty string which might be the case when input element is empty
    //use Usa as a fallback location
    const encodedLocation = encodeURIComponent(location || "Usa");
    const promise = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedLocation}&key=${env("MAPS_API_KEY")}`
    );
    const res = await promise.json();
    if (res.status !== "OK")
      throw new Error(
        res?.error_message || "Failed to find matching addresses"
      );

    return { data: res.predictions, status: "success", error: null };
  } catch (err: any) {
    return { data: null, status: "fail", error: err.message };
  }
}

/**
 * This function retieves loongitude and latitude of an address
 * @param address
 * @returns {ServerActionRes} data containing latitude and longitude of a given address
 */
export async function getLatLngFromAddress(
  address: string
): Promise<ServerActionRes> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const promise = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${env("MAPS_API_KEY")}`
    );
    const res = await promise.json();
    const { lat, lng } = res.results[0]?.geometry?.location;
    if (!lng || !lat) throw new Error("Failed to get address data from Google");
    if (res.status !== "OK" || res.results.length === 0)
      throw new Error("Failed to get address data from Google");
    return {
      error: null,
      data: {
        lat,
        lng,
      },
      status: "success",
    };
  } catch (err: any) {
    return { data: null, status: "fail", error: err.message };
  }
}
