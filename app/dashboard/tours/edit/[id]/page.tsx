import Tours from "@/components/forms/Tours";
import { env } from "@/utils/functions";

export const dynamic = "force-dynamic";
export default async function EditTourPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const promise = await fetch(`${env("API_URL")}/tours/${params.id}`);
    const res = await promise.json();
    if (res.status === "fail" || res.status === "error")
      throw new Error(res.err);
    const { tour }: { tour: TourDetailed } = res.data;
    return <Tours tourDetails={tour} />;
  } catch (err: any) {
    return (
      <div>
        {err?.message === ""
          ? "Something went wrong! please try again"
          : err.message}
      </div>
    );
  }
}
