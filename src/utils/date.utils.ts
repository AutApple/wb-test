export function getDay(): string {
    const now = Date.now();
    const date = new Date(now);
    return date.toISOString().split('T')[0];
}
