"use client";
import { deleteReview } from "@/utils/serverActions";
import { Avatar, Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { FaStar } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

export default function ReviewCard({
  review,
  currentUser,
  reloadReviews,
}: {
  review: Review;
  currentUser: string;
  reloadReviews: Dispatch<SetStateAction<boolean>>;
}) {
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
  const handleDeleteReview = async () => {
    if (review._id) await deleteReview(review._id);
    reloadReviews((prev) => !prev);
  };
  return (
    <Card>
      <CardBody className="flex gap-y-2 justify-center items-start">
        {currentUser === review.user._id && (
          <div className="absolute right-4 top-4">
            <FaTrashCan
              className="cursor-pointer z-50"
              onClick={handleDeleteReview}
            />
          </div>
        )}
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
