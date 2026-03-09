import pino from 'pino';
import { BaseJob } from './base.job.js';

export class SchedulerService {
    private running = false;

    constructor (private logger: pino.Logger) {}
    public async start(job: BaseJob, intervalMs: number): Promise<void> {
        if (this.running) throw new Error("Scheduler already running");
        this.running = true;

        while (this.running) {
            try {
                await job.execute();
                this.logger.info("Job executed successfully");
            } catch (err) {
                this.logger.error({err}, "Job failed to execute");
            }

            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }
    
    public isRunning(): boolean {
        return this.running;
    }

    public stop(): void {
        this.running = false;
    }
}