import React, { useState } from "react";
import "./Rating.css"; // Ensure to include your provided CSS file
import { Input } from "@nextui-org/input";
import { Radio, RadioGroup } from "@nextui-org/radio";

const Rating = ({
  setRating,
}: {
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const [rating, setRating] = useState<number>(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    // Handle further actions, e.g., submitting the rating to a backend
    console.log(`User rated: ${rate}`);
  };

  return (
    <div className="rating flex flex-row gap-x-4">
      {[1, 2, 3].map((star) => (
        <input
          className={`hidden rating__input rating__input-${star}`}
          type="radio"
          name="rating"
          id={`rating${star}`}
          onClick={() => handleRating(star)}
        />
      ))}
      {[1, 2, 3].map((star) => (
        <React.Fragment key={star}>
          <label
            className={`relative size-10 p-0 rating__label rating__label--delay${star}`}
            htmlFor={`rating${star}`}
          >
            <input
              className={`bg-transparent -z-0 rating__input rating__input-${star}`}
              type="radio"
              name="rating"
              id={`rating${star}`}
              onClick={() => handleRating(star)}
            />
            <svg
              className="absolute left-0 -top-1.5 z-10 rating__star"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <ellipse
                className="rating__star-shadow"
                cx="16"
                cy="31"
                rx="16"
                ry="1"
              />
              <g className="rating__star-body-g">
                <path
                  className="rating__star-body"
                  d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                />
              </g>
            </svg>
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Rating;
