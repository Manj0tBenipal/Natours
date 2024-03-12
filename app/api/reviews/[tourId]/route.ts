import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";
/**
 * This function fetches reviews base don tourId. By defualt 5 tours are fetched per page,
 * The next page can be requested sing page searchParam
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    const url = new URL(req.url);
    const page = `${url.searchParams.has("page") ? "&page=" + url.searchParams.get("page") : ""}`;
    const promise = await fetch(
      `${process.env.API_URL}/tours/${params.tourId}/reviews?limit=4${page}`
    );
    const res = await promise.json();
    return NextResponse.json({ ...res });
  } catch (err: any) {
    return NextResponse.json({ err: err.message, status: "fail" });
  }
}
