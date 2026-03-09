export function parseDecimal(val: string): number {
    return parseFloat(val.replace(',', '.').replace('-', '0'));
}

export function emptyStringToNull(val: string): string | null {
        return val && val.trim() !== '' ? val : null;
}
