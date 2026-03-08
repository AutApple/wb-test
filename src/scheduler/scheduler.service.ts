import { BaseJob } from './base.job.js';

export class SchedulerService {
    private jobMap: Map<string, NodeJS.Timeout> = new Map();

    constructor () {}

    public addJob(id: string, job: BaseJob, intervalMs: number): void {
        if (this.jobMap.get(id) !== undefined) throw new Error(`Job with id ${id} already exists`);
        const timeout = setInterval(job.execute.bind(job), intervalMs);
        this.jobMap.set(id, timeout);
    }
    public removeJob(id: string): void {
        const job = this.jobMap.get(id); 
        if (job === undefined) throw new Error(`Job with id ${id} doesn\'t exist`);
        job.close();
        this.jobMap.delete(id);
    }
}