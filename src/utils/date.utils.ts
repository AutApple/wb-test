export function getToday(): string {
    const now = Date.now();
    const date = new Date(now);
    return date.toISOString().split('T')[0];
}
