import React from "react";

export const StarItem = ({
  rating,
  selectedRating,
  setSelectedRating,
  allowClick = false,
  size = "md",
}: {
  rating: number;
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number | null>>;
  allowClick?: boolean;
  size?: "lg" | "md" | "sm";
}) => {
  let starSize;

  if (size === "sm") {
    starSize = 20;
  } else if (size === "md") {
    starSize = 28;
  } else if (size === "lg") {
    starSize = 32;
  } else {
    starSize = 28;
  }

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
          aria-describedby={`description-${rating}`}
          aria-labelledby={`label-${rating}`}
          checked={selectedRating === rating}
          name="rating"
          tabIndex={selectedRating === rating ? 0 : -1}
          type="radio"
          value={rating}
          onChange={allowClick ? handleRatingChange : () => null}
        />
      </div>
      <svg
        aria-hidden="true"
        className={`pointer-events-none transition-transform-colors group-data-[pressed=true]:scale-90 iconify iconify--solar ${
          selectedRating >= rating ? "text-warning" : "text-default-200"
        }`}
        height={starSize}
        role="img"
        viewBox="0 0 24 24"
        width={starSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
          fill="currentColor"
        />
      </svg>
    </label>
  );
};

const RatingComponent = ({
  selectedRating,
  setSelectedRating,
  starSize,
}: {
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number | null>>;
  starSize?: "lg" | "md" | "sm";
}) => {
  //   const [selectedRating, setSelectedRating] = useState(1);

  return (
    <div className="flex gap-3 flex-col-reverse items-start">
      <div
        aria-label=" "
        aria-orientation="horizontal"
        className="relative flex flex-col gap-2"
        role="radiogroup"
      >
        <div
          className="flex flex-col flex-wrap gap-2 data-[orientation=horizontal]:flex-row"
          data-orientation="horizontal"
          role="presentation"
        >
          {[1, 2, 3].map((rating) => (
            <StarItem
              key={rating}
              allowClick={true}
              rating={rating}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              size={starSize}
            />
          ))}
        </div>
      </div>
      {/* <span className="text-small">Rating</span> */}
    </div>
  );
};

export default RatingComponent;
