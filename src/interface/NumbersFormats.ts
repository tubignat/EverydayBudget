export function formatMoney(number: number) {
    return (Math.round(number) === 0 ? 0 : number)
        .toLocaleString('ru-RU', {maximumFractionDigits: 0})
        .replace(/\s+/g, '\u2009');
}

export function abbreviateNumber(number: number) {
    return number < 1000
        ? number.toLocaleString(undefined, {maximumFractionDigits: 1})
        : number < 1000000 ? `${(number / 1000).toLocaleString(undefined, {maximumFractionDigits: 1})}K`
            : `${(number / 1000000).toLocaleString(undefined, {maximumFractionDigits: 1})}M`
}

export function getTimeString(hour: number, minute: number) {
    const hourString = hour.toString().padStart(2, '0')
    const minuteString = minute.toString().padStart(2, '0')

    return `${hourString}:${minuteString}`;
}

