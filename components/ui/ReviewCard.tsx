import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";

export default function ReviewCard({ review }: { review: Review }) {
  const stars: JSX.Element[] = [] as JSX.Element[];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      review.rating >= i ? (
        <FaStar color="var(--color-primary)" />
      ) : (
        <FaStar color="grey" />
      )
    );
  }
  return (
    <Card>
      <CardBody>
        <p>{review.text}</p>
      </CardBody>
      <CardFooter>
        <div className="flex items-start justify-center">
          {stars.map((star) => star)}
        </div>
      </CardFooter>
    </Card>
  );
}
