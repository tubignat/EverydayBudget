export function formatMoney(number: number) {
    return (Math.round(number) === 0 ? 0 : number)
        .toLocaleString('ru-RU', {maximumFractionDigits: 0})
        .replace(/\s+/g, '\u2009');
}
