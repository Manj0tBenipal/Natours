"use client";

import { Button, Input } from "@nextui-org/react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { UserContext } from "./providers/UserContextProvider";
import { postReview } from "@/utils/serverActions";
import { useRouter } from "next/navigation";

export default function AddReview({
  tourId,
  reloadReviews,
  changeToLastPage,
}: {
  tourId: string;
  reloadReviews: Dispatch<SetStateAction<boolean>>;
  changeToLastPage: Function;
}) {
  //logged in user
  const { user } = useContext(UserContext);
  const router = useRouter();
  const wordLimit = 300;

  //stars given to the tour
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [wordsRemaining, setWordsRemaining] = useState(wordLimit);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const ratingButtons: JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    ratingButtons.push(
      <FaStar
        key={i}
        color={rating >= i + 1 ? "var(--color-primary)" : "grey"}
        onClick={() => setRating(i + 1)}
      />
    );
  }
  useEffect(() => {
    setWordsRemaining(reviewText ? wordLimit - reviewText.length : 300);
  }, [reviewText]);

  const handlePostReview = async () => {
    try {
      const review: Review = { tourId } as Review;
      if (reviewText?.length > 0) review.text = reviewText;
      review.rating = rating;
      setIsPosting(true);
      const res = await postReview(JSON.stringify(review));
      if (res.status == "fail") throw new Error(res.error || "");

      setIsPosting(false);
      resetForm();

      //trigger refresh of the server rendered components
      router.refresh();

      //trigger refresh  of reviews rendered on client side
      reloadReviews((prev) => !prev);
      changeToLastPage();
    } catch (err: any) {
      alert(err.message);
      setIsPosting(false);
    }
  };
  const resetForm = () => {
    setRating(1);
    setReviewText("");
  };
  return (
    <div className="flex justify-between items-start flex-col gap-y-3">
      {Object.keys(user).length === 0 && (
        <p className="text-red-500"> You need to be logged in to post review</p>
      )}
      <Input
        type="text"
        placeholder="Your Review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        endContent={
          <span className="text-slate-400">
            <span className={`${wordsRemaining < 0 ? "text-red-500" : ""}`}>
              {wordsRemaining}
            </span>
            /300
          </span>
        }
      />
      <div className="flex items-center justify-center">
        {ratingButtons.map((button) => button)}
      </div>
      <Button
        isLoading={isPosting}
        onPress={handlePostReview}
        spinner={<FaSpinner className="animate-spin" />}
        isDisabled={wordsRemaining < 0 || Object.keys(user).length === 0}
        color="primary"
      >
        Add
      </Button>
    </div>
  );
}
