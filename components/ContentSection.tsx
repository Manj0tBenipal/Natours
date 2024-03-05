import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import contentParsed from "@/data/contentSection.json";
interface Content {
  text: string;
  heading: string;
  buttonOptions: {
    buttonText: string;
    link: string;
  };
  image: string;
}

export default function ContentSection() {
  try {
    const content: Content[] = contentParsed;
    const contentJSX = content.map((c, index) => (
      <div key={c.heading}>
        <div className={`flex ${index % 2 !== 0 ? "flex-row-reverse" : ""}`}>
          <div className="relative  min-w-half">
            <Image
              priority
              quality={100}
              src={c.image}
              fill
              alt="trending illustration"
            />
          </div>
          <div
            className={`relative flex flex-col gap-y-10 justify-center align-start min-w-half`}
          >
            <h1 className="text-4xl font-extrabold text-gradient mb-3">
              {c.heading}
            </h1>
            <p className="font-medium text-lg mt-4">{c.text}</p>
            <Button
              as={Link}
              className="w-min"
              color="primary"
              variant="ghost"
              href={c.buttonOptions.link}
            >
              {c.buttonOptions.buttonText}
            </Button>
          </div>
        </div>
      </div>
    ));
    return <div className="flex flex-col gap-y-32">{contentJSX}</div>;
  } catch (err) {
    console.log(err);
    return null;
  }
}
