import { BoxTarrifsDatabaseService } from './box-tarrifs/box-tarrifs-db.service.js';
import { BoxTarrifsService } from './box-tarrifs/box-tarrifs.service.js';
import envConfig from './config/env.config.js';
import db from './db/db.js';
import { SchedulerService } from './scheduler/scheduler.service.js';
import { TestJob } from './test.job.js';
import { getDay } from './utils/date.utils.js';

// const scheduler = new SchedulerService();

// const testJob = new TestJob('Hello!');

// const testJob2 = new TestJob(envConfig.POSTGRES_HOST);

// scheduler.addJob('test1', testJob, 2000);
// scheduler.addJob('test2', testJob2, 5000);


async function fetchAndUpsertTarrifsToday() {
    const boxTarrifService = new BoxTarrifsService();
    const boxTarrifDbService = new BoxTarrifsDatabaseService(db);
    const tarrifs = await boxTarrifService.fetchToday();
    await boxTarrifDbService.upsertTarrif(tarrifs, getDay());
    console.log('Success');
}

fetchAndUpsertTarrifsToday();