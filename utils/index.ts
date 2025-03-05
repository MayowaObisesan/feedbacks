import { useBrandRead } from "@/hooks/useRead";
import { IProfile } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import { Address } from "viem";
import { decryptClient } from "@/utils/clientCrypt";

interface I_SendToIPFSProps {
    dp: string | Blob;
    setisDpUploading: (arg0: boolean) => void | React.Dispatch<React.SetStateAction<boolean>>;
    imageHashRef: { current: any; };
    setImageHash: (arg0: string) => void | React.Dispatch<React.SetStateAction<string>>;
    setImageUploadPending: (arg0: boolean) => void | React.Dispatch<React.SetStateAction<boolean>>;
    setImageUploadSuccessful: (arg0: boolean) => void | React.Dispatch<React.SetStateAction<boolean>>;
}

export function cleanBrandRawName(brandName: string) {
    return brandName.trim().toLowerCase().split(" ").join("_");
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// FETCH USER PROFILE HELPER FUNCTION
export const FetchUserProfile = (address: Address) => {
    const { data } = useBrandRead({
        functionName: "getProfile",
        args: [address],
    });
    return data as IProfile;
};

export function RatingTag(rating: number) {
    switch (rating) {
        case 1:
            return "Poor";
        case 2:
            return "Average";
        case 3:
            return "Excellent";
        default:
            return "Invalid";
    }

}

export function parseImageHash(imageSrc: string) {
    return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${imageSrc}`;
}

export function formatCount(num: number, precision: number = 1) {
    const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
    ];
    const found = map.find(x => Math.abs(num) >= x.threshold);
    if (found) {
        return (num / found.threshold).toFixed(precision) + found.suffix;
    }
    return num;
}

// Example usage:
// console.log(formatCount(15000)); // Output: 15K

export const shortenAddress = (addr: string) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export function formattedDate(_currentDate: any) {
    return _currentDate.toLocaleString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export const formatDate = (time: number) => {
    // Convert the timestamp to milliseconds by multiplying it by 1000
    const date = new Date(time * 1000);

    // Get the year, month, and day components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month
    const day = date.getDate();

    // Create an array of month names to map the numeric month to its name
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Get the month name using the month value as an index in the monthNames array
    const monthName = monthNames[month - 1];

    const formattedDate = `${monthName} ${day}, ${year}`;

    return formattedDate;
};

const sendFileToIPFS = async (dp: string, setisDpUploading: React.Dispatch<React.SetStateAction<boolean>>, imageHashRef: { current: any; }, setImageHash: React.Dispatch<React.SetStateAction<string>>, setImageUploadPending: React.Dispatch<React.SetStateAction<boolean>>, setImageUploadSuccessful: React.Dispatch<React.SetStateAction<boolean>>) => {
    // console.log(dp, process.env.NEXT_PUBLIC_PINATA_JWT);
    if (dp) {
        try {
            const formData = new FormData();
            formData.append("file", dp);

            setisDpUploading(true);
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
                    // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                },
            });

            const ImgHash = `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log(ImgHash);
            imageHashRef.current = resFile?.data?.IpfsHash;
            setImageHash(resFile?.data?.IpfsHash);
            setImageUploadSuccessful(true);

            //Take a look at your Pinata Pinned section, you will see a new file added to you list.
            toast.success("Dp uploaded successfully");
        } catch (error) {
            console.log("Error sending File to IPFS: ");
            console.log(error);
            toast.error("Error uploading display picture");
            setImageUploadSuccessful(false);
        } finally {
            setisDpUploading(false);
            setImageUploadPending(false);
        }
    }
};
