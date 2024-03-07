import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FaDollarSign, FaStar } from "react-icons/fa";
interface TourShort {
  _id: string;
  name: string;
  ratingsAverage: string;
  summary: string;
  imageCover: string;
  price: number;
  difficulty: string;
}
export default async function Tours() {
  try {
    /*
     * Only selecting those fields that are needed in the card
     */
    const toursRes = await fetch(
      `${process.env.API_URL}/tours?fields=imageCover,ratingsAverage,summary,name,difficulty,price`
    );
    const res = await toursRes.json();
    if (res.status === "fail") throw new Error("Something went wrong");
    if (res.data.length === 0) return <div>No results found</div>;
    const tours = res.data;
    const cards = tours.map((tour: TourShort) => {
      return (
        <Card
          as={Link}
          href={`/tours/${tour._id}`}
          isBlurred={true}
          key={tour._id}
          className="w-full py-3 px-1 rounded-2xl
          "
          isFooterBlurred={true}
        >
          <CardHeader className="relative  shadow-sm rounded-2xl overflow-hidden w-full aspect-video ">
            <Image
              src={`/tourImages/${tour.imageCover}`}
              fill
              priority
              objectFit="cover"
              alt="tour Image"
            />
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center gap-3 my-2 p-4 rounded-xl bg-[var(--color-primary)] text-white">
            <p className="text-2xl  font-bold text-center">{tour.name}</p>
            <div className="flex gap-x-2 items-center  justify-center w-fit  text-xl font-semibold">
              Difficulty: {tour.difficulty}
            </div>
            <p className="text-xl">{tour.summary}</p>
            <div className="flex w-full py-2 items-center justify-center gap-4 text-[var(--color-primary)]">
              <div className="py-2 px-8 shadow-md rounded-3xl flex gap-x-2 items-center  justify-center w-fit bg-white">
                <FaStar />
                {tour.ratingsAverage}
              </div>
              <div className="py-2 px-8 shadow-md rounded-3xl flex gap-x-2 items-center  justify-center w-fit bg-white">
                <FaDollarSign />
                {tour.price}
              </div>
            </div>
          </CardBody>
        </Card>
      );
    });
    return (
      <div className="grid grid-cols-1 justify-items-center gap-1  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ">
        {cards}
      </div>
    );
  } catch (err) {
    return <div>Somehting went wrong</div>;
  }
}
