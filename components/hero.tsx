import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import Image from "next/image";

export default function Hero() {
  return (
    <div
      className="max-w-full grid grid-cols-2 h-dvh"
      style={{ maxHeight: 780 }}
    >
      <div className="flex flex-col space-y-4	font-extrabold mt-32 ">
        <p className="text-4xl	font-extrabold">
          Tours that bring once in a
          <span className="text-gradient">&nbsp; lifetime &nbsp;</span>
          moment. Explore What we offer.
        </p>
        <p className="font-medium w-5/6 ">
          Natours is Canada based company that offers tour services acroos the
          world. With each tour featuring a local guide, You&apos;ll explore
          every wonder that a destination has to offer!
        </p>
        <Button
          className="w-3/12"
          as={Link}
          href="/tours"
          color="primary"
          variant="shadow"
        >
          Explore
        </Button>
      </div>

      <div className="relative">
        <Image priority quality={100} src="/hero.svg" alt="hero image" fill />
      </div>
    </div>
  );
}
