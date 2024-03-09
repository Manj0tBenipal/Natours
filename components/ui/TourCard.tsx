import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FaDollarSign, FaStar } from "react-icons/fa";

export default function TourCard({ data }: { data: TourShort }) {
  return (
    <Card
      as={Link}
      href={`/tours/${data._id}`}
      isBlurred={true}
      key={data._id}
      className="w-full py-3 px-1 rounded-2xl
          "
      isFooterBlurred={true}
    >
      <CardHeader className="relative  shadow-sm rounded-2xl overflow-hidden w-full aspect-video ">
        <Image
          src={`/tourImages/${data.imageCover}`}
          fill
          priority
          objectFit="cover"
          alt="data Image"
        />
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center gap-3 my-2 p-4 rounded-xl bg-[var(--color-primary)] text-white">
        <p className="text-2xl  font-bold text-center">{data.name}</p>
        <div className="flex gap-x-2 items-center  justify-center w-fit  text-xl font-semibold">
          Difficulty: {data.difficulty}
        </div>
        <p className="text-xl">{data.summary}</p>
        <div className="flex w-full py-2 items-center justify-center gap-4 text-[var(--color-primary)]">
          <div className="py-2 px-8 shadow-md rounded-3xl flex gap-x-2 items-center  justify-center w-fit bg-white">
            <FaStar />
            {data.ratingsAverage}
          </div>
          <div className="py-2 px-8 shadow-md rounded-3xl flex gap-x-2 items-center  justify-center w-fit bg-white">
            <FaDollarSign />
            {data.price}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
