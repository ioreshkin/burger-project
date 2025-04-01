export const formatRelativeDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const timeDiff = today.getTime() - inputDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const timeStr = timeFormatter.format(date);

    if (dayDiff === 0) {
        return `Сегодня, ${timeStr}`;
    } else if (dayDiff === 1) {
        return `Вчера, ${timeStr}`;
    } else if (dayDiff > 1 && dayDiff <= 4) {
        return `${dayDiff} дня назад, ${timeStr}`;
    } else {
        return `${dayDiff} дней назад, ${timeStr}`;
    }
};