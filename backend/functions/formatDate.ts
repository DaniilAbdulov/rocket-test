export function formatDate(t: number): string {
    const date = new Date(t * 1000);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    //форматируем таймстамп в читаемые dd/mm/yyyy hh:mm
    return date.toLocaleDateString("ru-RU", options);
}
