import { BaseJob } from './scheduler/base.job.js';

export class TestJob extends BaseJob {
    constructor (private message: string) {
        super();
    }
    public execute(): void {
        console.log(`Test job is working. Message: ${this.message}`);
    }

}