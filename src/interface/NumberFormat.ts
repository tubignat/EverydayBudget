export function formatMoney(number: number) {
    return number
        .toLocaleString('ru-RU', { maximumFractionDigits: 0 })
        .replace(/\s+/g, '\u2009');
}