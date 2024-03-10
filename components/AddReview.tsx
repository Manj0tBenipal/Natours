"use client";

import { Button, Input } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { UserContext } from "./providers/UserContextProvider";

export default function AddReview() {
  const wordLimit = 300;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [wordsRemaining, setWordsRemaining] = useState(wordLimit);
  const { user } = useContext(UserContext);
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
        isDisabled={wordsRemaining < 0 || Object.keys(user).length === 0}
        color="primary"
      >
        Add
      </Button>
    </div>
  );
}
