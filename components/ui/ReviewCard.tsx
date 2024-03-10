import { Avatar, Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
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
      <CardBody className="flex gap-y-2 justify-center items-start">
        <div className="flex items-center gap-x-2">
          <Avatar
            src={`/users/${review.user.photo} `}
            name={review.user.name}
          />
          <p className="text-[var(--color-primary-light)] font-bold">
            {review.user.name}
          </p>
        </div>
        <Divider orientation="horizontal" />
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
