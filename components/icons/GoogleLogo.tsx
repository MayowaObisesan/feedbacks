import React from "react";

interface CameraIconProps {
  fill?: string;
  filled?: boolean;
  size?: number;
  height?: number;
  width?: number;
  label?: string;

  [key: string]: any;
}

export const GoogleLogo: React.FC<CameraIconProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filled,
  size,
  height,
  width,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  label,
  ...props
}) => {
  return (
    <svg
      fill="none"
      // height="768"
      height={size || height || 24}
      viewBox="0 0 754 768"
      // width="754"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M753.32 392.727C753.32 365.498 750.876 339.316 746.338 314.182H384.68V462.895H591.342C582.266 510.72 555.036 551.215 514.193 578.444V675.142H638.818C711.429 608.116 753.32 509.673 753.32 392.727Z"
        fill="#4285F4"
      />
      <path
        d="M384.68 768C488.36 768 575.284 733.789 638.818 675.142L514.193 578.444C479.982 601.484 436.346 615.447 384.68 615.447C284.84 615.447 200.011 548.073 169.64 457.309H41.8728V556.451C105.058 681.775 234.571 768 384.68 768Z"
        fill="#34A853"
      />
      <path
        d="M169.64 456.96C161.96 433.92 157.422 409.484 157.422 384C157.422 358.516 161.96 334.08 169.64 311.04V211.898H41.8728C15.691 263.564 0.680054 321.862 0.680054 384C0.680054 446.138 15.691 504.436 41.8728 556.102L141.364 478.604L169.64 456.96Z"
        fill="#FBBC05"
      />
      <path
        d="M384.68 152.902C441.233 152.902 491.502 172.451 531.647 210.153L641.611 100.189C574.935 38.0509 488.36 0 384.68 0C234.571 0 105.058 86.2255 41.8728 211.898L169.64 311.04C200.011 220.276 284.84 152.902 384.68 152.902Z"
        fill="#EA4335"
      />
    </svg>
  );
};
