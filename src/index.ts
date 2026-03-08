import envConfig from './config/env.config.js';
import { SchedulerService } from './scheduler/scheduler.service.js';
import { TestJob } from './test.job.js';

const scheduler = new SchedulerService();

const testJob = new TestJob('Hello!');

const testJob2 = new TestJob(envConfig.POSTGRES_HOST);


scheduler.addJob('test1', testJob, 2000);
scheduler.addJob('test2', testJob2, 5000);