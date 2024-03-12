import Image from "next/image";

export default function ImageGallery({ tour }: { tour: TourDetailed }) {
  return (
    <div className="relative grid sm:grid-cols-3 sm:grid-rows-none sm:h-[40vh] h-dvh grid-rows-3 gap-2 ">
      {tour.images.map((image) => (
        <div
          key={image}
          className="relative h-full  w-full rounded-2xl overflow-hidden shadow-md"
        >
          <Image
            priority
            className="object-cover"
            src={`/tourImages/${image}`}
            fill
            quality={60}
            alt="tour-image-gallery"
          />
        </div>
      ))}
    </div>
  );
}
