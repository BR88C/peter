import { WorkerManager } from '../WorkerManager';

void new WorkerManager();

declare module 'discord-rose/dist/typings/lib' { // eslint-disable-line quotes
    type worker = WorkerManager
};
