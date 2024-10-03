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