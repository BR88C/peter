"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.progressBar = exports.dateTimestamp = void 0;
const dateTimestamp = (time) => {
    const second = time.getSeconds().toString().padStart(2, `0`);
    const minute = time.getMinutes().toString().padStart(2, `0`);
    const hour = time.getHours().toString().padStart(2, `0`);
    const day = time.getDate().toString().padStart(2, `0`);
    const month = (time.getMonth() + 1).toString().padStart(2, `0`);
    const year = time.getFullYear().toString();
    return `${month}-${day}-${year} ${hour}:${minute}:${second}`;
};
exports.dateTimestamp = dateTimestamp;
const progressBar = (percent, length) => {
    if (length % 2 === 0)
        throw new Error(`length must be an odd integer.`);
    const lengthCompleted = Math.round(percent * (length - 1));
    return `${`─`.repeat(lengthCompleted)}🔘${`─`.repeat((length - 1) - lengthCompleted)}`;
};
exports.progressBar = progressBar;
const timestamp = (time) => {
    time = Math.round(time / 1e3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) - (hours * 60);
    const seconds = time % 60;
    return hours > 0 ? `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}` : `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;
};
exports.timestamp = timestamp;
