import { TarrifsSequentialUpdateJob } from './box-tarrifs/jobs/tarrifs-sequential-update.job.js';
import { appConfiguration } from './config/app.config.js';
import { SchedulerService } from './scheduler/scheduler.service.js';

export class WbTestApplication {
    private tarrifUpdateScheduler = new SchedulerService();
    constructor () {}

    public run() {
        const tarrifUpdateJob = new TarrifsSequentialUpdateJob();
        this.tarrifUpdateScheduler.start(tarrifUpdateJob, appConfiguration.intervalMin * 60 * 1000);    
    }
}