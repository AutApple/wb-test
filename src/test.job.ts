import { BaseJob } from './scheduler/base.job.js';

export class TestJob extends BaseJob {
    constructor (private message: string) {
        super();
    }
    public async execute(): Promise<void> {
        console.log(`Test job is working. Message: ${this.message}`);
    }
}