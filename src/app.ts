import pino from 'pino';
import { TarrifsSequentialUpdateJob } from './box-tariffs/jobs/tariffs-sequential-update.job.js';
import type { WBTestConfiguration } from './config/app.config.js';
import { SchedulerService } from './scheduler/scheduler.service.js';

export class WbTestApplication {
	private logger = pino({
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	});
	private tariffUpdateScheduler = new SchedulerService(this.logger);

	constructor(private appConfig: WBTestConfiguration) {}

	public async run() {
		const tariffUpdateJob = new TarrifsSequentialUpdateJob(this.appConfig);
		await tariffUpdateJob.init();
		this.tariffUpdateScheduler.start(tariffUpdateJob, this.appConfig.intervalMin * 60 * 1000);
	}
}
