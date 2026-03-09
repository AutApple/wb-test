import { TarrifsSequentialUpdateJob } from './box-tarrifs/jobs/tarrifs-sequential-update.job.js';
import { appConfiguration } from './config/server.config.js';
import { SchedulerService } from './scheduler/scheduler.service.js';

export class WbTestApplication {
    private scheduler = new SchedulerService();
    constructor () {}

    public run() {
        const tarrifUpdateJob = new TarrifsSequentialUpdateJob();
        this.scheduler.addJob('updateTarrifs', tarrifUpdateJob, appConfiguration.intervalMin * 60 * 1000);    
    }
}