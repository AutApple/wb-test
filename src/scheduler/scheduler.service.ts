import { BaseJob } from './base.job.js';

export class SchedulerService {
    private jobMap: Map<string, NodeJS.Timeout> = new Map();

    constructor () {}


    private async runJob(id: string, job: BaseJob, intervalMs: number): Promise<void> {
        if (!this.jobMap.has(id)) return;
        try {
            await job.execute();
        } catch (err) {
            console.error(`Job ${id} failed:`, err);
        }

        const timeout = setTimeout(() => this.runJob(id, job, intervalMs), intervalMs);
        this.jobMap.set(id, timeout);
    }
    
    public addJob(id: string, job: BaseJob, intervalMs: number): void {
        if (this.jobMap.has(id)) throw new Error(`Job with id ${id} already exists`);
        const timeout = setTimeout(() => this.runJob(id, job, intervalMs), intervalMs);
        this.jobMap.set(id, timeout);
    }


    public removeJob(id: string): void {
        const job = this.jobMap.get(id); 
        if (job === undefined) throw new Error(`Job with id ${id} doesn\'t exist`);
        clearInterval(job);
        this.jobMap.delete(id);
    }
}