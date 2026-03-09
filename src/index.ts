import { BoxTarrifsDatabaseService } from './box-tarrifs/box-tarrifs-db.service.js';
import { BoxTarrifsApiService } from './box-tarrifs/box-tarrifs-api.service.js';
import db from './db/db.js';
import { SchedulerService } from './scheduler/scheduler.service.js';
import { getToday } from './utils/date.utils.js';
import { BoxTarrifsSheetsService } from './box-tarrifs/box-tarrifs-sheets.service.js';
import { appConfiguration } from './config/server.config.js';

// const scheduler = new SchedulerService();

// const testJob = new TestJob('Hello!');

// const testJob2 = new TestJob(envConfig.POSTGRES_HOST);

// scheduler.addJob('test1', testJob, 2000);
// scheduler.addJob('test2', testJob2, 5000);

async function fetchAndUpsertTarrifsToday() {
    const boxTarrifService = new BoxTarrifsApiService();
    const boxTarrifDbService = new BoxTarrifsDatabaseService(db);
    const tarrifs = await boxTarrifService.fetchToday();
    await boxTarrifDbService.upsertTarrif(tarrifs, getToday());
    console.log('Success');
}

fetchAndUpsertTarrifsToday();

// async function test() {
//     const boxTarrifDbService = new BoxTarrifsDatabaseService(db);
//     const boxTarrifSheetService = new BoxTarrifsSheetsService(
//         boxTarrifDbService, { 
//             tabName: appConfiguration.tabName,
//             parallelLimit: 10
//         }
//     );

//     await boxTarrifSheetService.initializeSpreadsheets(appConfiguration.sheetIds);
//     await boxTarrifSheetService.syncSpreadsheetsWithDb();
// }
// test();