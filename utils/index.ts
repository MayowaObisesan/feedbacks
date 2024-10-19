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
    return num.toString();
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