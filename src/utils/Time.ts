/**
 * Creates a timestamp.
 * @param time Time in milliseconds.
 * @returns The timestamp string.
 */
export const timestamp = (time: number): string => {
    time = Math.round(time / 1e3);
    const hours: number = Math.floor(time / 60 / 60);
    const minutes: number = Math.floor(time / 60) - (hours * 60);
    const seconds: number = time % 60;
    return hours > 0 ? `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}` : `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;
};

/**
 * Creates a date timestamp.
 * @param time A date class to create the timestamp from.
 * @returns The date timestamp string.
 */
export const dateTimestamp = (time: Date): string => {
    const second: string = time.getSeconds().toString().padStart(2, `0`);
    const minute: string = time.getMinutes().toString().padStart(2, `0`);
    const hour: string = time.getHours().toString().padStart(2, `0`);
    const day: string = time.getDate().toString().padStart(2, `0`);
    const month: string = (time.getMonth() + 1).toString().padStart(2, `0`);
    const year: string = time.getFullYear().toString();
    return `${month}-${day}-${year} ${hour}:${minute}:${second}`;
};
