import React, { useState } from "react";

export const StarItem = ({
  rating,
  selectedRating,
  setSelectedRating,
  allowClick = false,
}: {
  rating: number;
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number | null>>;
  allowClick?: boolean;
}) => {
  const handleRatingChange = (event: { target: { value: any } }) => {
    if (allowClick) setSelectedRating(Number(event.target.value));
  };

  return (
    <label
      //   key={rating}
      className={`group relative max-w-fit inline-flex items-center justify-start cursor-pointer tap-highlight-transparent p-2 -m-2 ${
        selectedRating === rating ? "text-warning" : "text-default-200"
      }`}
    >
      <div
        style={{
          border: "0px",
          clip: "rect(0px, 0px, 0px, 0px)",
          clipPath: "inset(50%)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: "0px",
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap",
        }}
      >
        <input
          aria-labelledby={`label-${rating}`}
          aria-describedby={`description-${rating}`}
          tabIndex={selectedRating === rating ? 0 : -1}
          type="radio"
          value={rating}
          checked={selectedRating === rating}
          name="rating"
          onChange={allowClick ? handleRatingChange : () => null}
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        className={`pointer-events-none transition-transform-colors group-data-[pressed=true]:scale-90 iconify iconify--solar ${
          selectedRating >= rating ? "text-warning" : "text-default-200"
        }`}
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
        />
      </svg>
    </label>
  );
};

const RatingComponent = ({
  selectedRating,
  setSelectedRating,
}: {
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  //   const [selectedRating, setSelectedRating] = useState(1);

  return (
    <div className="flex gap-3 flex-col-reverse items-start">
      <div
        className="relative flex flex-col gap-2"
        aria-label=" "
        role="radiogroup"
        aria-orientation="horizontal"
      >
        <div
          className="flex flex-col flex-wrap gap-2 data-[orientation=horizontal]:flex-row"
          role="presentation"
          data-orientation="horizontal"
        >
          {[1, 2, 3].map((rating) => (
            <StarItem
              key={rating}
              rating={rating}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              allowClick={true}
            />
          ))}
        </div>
      </div>
      {/* <span className="text-small">Rating</span> */}
    </div>
  );
};

export default RatingComponent;
