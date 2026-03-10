import type { WBTestConfiguration } from '../../config/app.config.js';
import db from '../../db/db.js';
import { BaseJob } from '../../scheduler/base.job.js';
import { getToday } from '../../utils/date.utils.js';
import { BoxTariffsApiService } from '../box-tariffs-api.service.js';
import { BoxTariffsDatabaseService } from '../box-tariffs-db.service.js';
import { BoxTariffsSheetsService } from '../box-tariffs-sheets.service.js';

/**
 * Sequential tarrif update job.
 *
 * This job orchestrates all of the services
 *
 */
export class TarrifsSequentialUpdateJob extends BaseJob {
	private tarrifsDbService: BoxTariffsDatabaseService;
	private tarrifsApiService: BoxTariffsApiService;
	private tarrifsSheetsService: BoxTariffsSheetsService;

	constructor(private appConfig: WBTestConfiguration) {
		super();
		this.tarrifsApiService = new BoxTariffsApiService();
		this.tarrifsDbService = new BoxTariffsDatabaseService(db);
		this.tarrifsSheetsService = new BoxTariffsSheetsService(this.tarrifsDbService, {
			parallelLimit: appConfig.parallelChunkSizeLimit,
			tabName: appConfig.tabName,
			sheetHeaders: appConfig.defaultSheetHeaders,
		});
	}

	public async init() {
		await this.tarrifsSheetsService.initializeSpreadsheets(this.appConfig.sheetIds);
	}

	public async execute(): Promise<void> {
		const tarrifs = await this.tarrifsApiService.fetchToday();
		await this.tarrifsDbService.upsertTariff(tarrifs, getToday());
		await this.tarrifsSheetsService.syncSpreadsheetsWithDb();
	}
}
