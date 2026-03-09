import pino from 'pino';
import { TarrifsSequentialUpdateJob } from './box-tariffs/jobs/tariffs-sequential-update.job.js';
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
    private tariffUpdateScheduler = new SchedulerService(this.logger);

    constructor () {}

    public async run() {
        const tariffUpdateJob = new TarrifsSequentialUpdateJob();
        await tariffUpdateJob.init();
        this.tariffUpdateScheduler.start(tariffUpdateJob, appConfiguration.intervalMin * 60 * 1000);    
    }
}