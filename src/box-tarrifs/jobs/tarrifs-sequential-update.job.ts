import { appConfiguration } from '../../config/server.config.js';
import db from '../../db/db.js';
import { BaseJob } from '../../scheduler/base.job.js';
import { getToday } from '../../utils/date.utils.js';
import { BoxTarrifsApiService } from '../box-tarrifs-api.service.js';
import { BoxTarrifsDatabaseService } from '../box-tarrifs-db.service.js';
import { BoxTarrifsSheetsService } from '../box-tarrifs-sheets.service.js';

/**
 * Sequential tarrif update job.
 * 
 * This job orchestrates all of the services
 * 
 */
export class TarrifsSequentialUpdateJob extends BaseJob{
    private tarrifsDbService: BoxTarrifsDatabaseService;
    private tarrifsApiService: BoxTarrifsApiService;
    private tarrifsSheetsService: BoxTarrifsSheetsService;

    constructor() {
        super();
        this.tarrifsApiService = new BoxTarrifsApiService();
        this.tarrifsDbService = new BoxTarrifsDatabaseService(db);
        this.tarrifsSheetsService = new BoxTarrifsSheetsService(this.tarrifsDbService, {
            parallelLimit: appConfiguration.parallelChunkSizeLimit,
            tabName: appConfiguration.tabName
        });
    }

    public async execute(): Promise<void> {
           const tarrifs = await this.tarrifsApiService.fetchToday();
           await this.tarrifsDbService.upsertTarrif(tarrifs, getToday());
           await this.tarrifsSheetsService.initializeSpreadsheets(appConfiguration.sheetIds);
           await this.tarrifsSheetsService.syncSpreadsheetsWithDb();
    }
}