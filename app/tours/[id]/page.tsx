import Mapbox from "@/components/Mapbox";
import ReviewsSection from "@/components/ReviewsSection";
import Avatar from "@/components/ui/Avatar";
import { user } from "@nextui-org/theme";
import Image from "next/image";
import React from "react";
import { FaClock, FaStar } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

export default async function Tour({ params }: { params: { id: string } }) {
  try {
    //get tour by id
    const tourPromise = await fetch(
      `${process.env.API_URL}/tours/${params.id}`
    );
    const tourRes = await tourPromise.json();
    //destructure the object
    const { data, status, err } = tourRes;
    //throw an error in case of API error which will display the error on page
    if (status === "fail") throw new Error(err);

    //on successfull response the data will contain the tour
    const { tour }: { tour: TourDetailed } = data;

    return (
      <>
        <div className="flex flex-col gap-y-4  min-h-dvh">
          <div className="relative min-h-[420px]  h-full w-full rounded-2xl overflow-hidden">
            <Image
              priority
              src={`/tourImages/${tour.imageCover}`}
              fill
              alt={`${tour.name} cover image`}
              className="object-cover absolute top-0 left-0 z-0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-3 w-full rounded-xl bg-slate-200 p-4 h-full">
              <h1 className="text-4xl font-extrabold text-gradient z-10 my-4 relative">
                {tour.name}
              </h1>
              <span className="text-xl">{tour.summary}</span>
              <div className="flex flex-col gap-y-4 font-medium">
                <span className="flex gap-x-2 items-center ">
                  <FaClock /> {tour.duration} days
                </span>
                <span className="flex gap-x-2 items-center">
                  <FaLocationPin /> {tour.startLocation.address}
                </span>
                <span className="flex gap-x-2 items-center">
                  <FaStar /> {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-3 w-full rounded-xl bg-[var(--color-primary)] text-white p-4 h-full ">
              <p>{tour.description}</p>
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-gradient font-bold">Your Guides</h1>
            <div className="flex flex-col gap-y-2 py-4 items-start">
              {tour?.guides?.length > 0 &&
                tour.guides.map((guide: User) => (
                  <Avatar key={user.name} user={guide} />
                ))}
            </div>
          </div>
          <Mapbox tour={tour} />
          <ReviewsSection tourId={tour._id} />
        </div>
      </>
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}
