import pino from 'pino';
import { TarrifsSequentialUpdateJob } from './box-tarrifs/jobs/tarrifs-sequential-update.job.js';
import { appConfiguration } from './config/app.config.js';
import { SchedulerService } from './scheduler/scheduler.service.js';

export class WbTestApplication {
    private logger = pino({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    });
    private tarrifUpdateScheduler = new SchedulerService(this.logger);
    
    constructor () {}

    public run() {
        const tarrifUpdateJob = new TarrifsSequentialUpdateJob();
        this.tarrifUpdateScheduler.start(tarrifUpdateJob, appConfiguration.intervalMin * 60 * 1000);    
    }
}