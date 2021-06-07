import { WorkerManager } from '../WorkerManager';

new WorkerManager();

declare module 'discord-rose/dist/typings/lib' {
    type worker = WorkerManager
}
