import { BoxTariffsDatabaseService } from './box-tariffs-db.service.js';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import envConfig from '../config/env.config.js';
import pLimit from 'p-limit';
import { BoxTariffType } from './dto/box-tariff.dto.js';
import { getToday } from '../utils/date.utils.js';
import {
	boxTariffToSheetData,
	SheetDataHeaders,
} from './mappers/box-tariff-to-sheet-data.mapper.js';

export interface BoxTarrifsSheetsServiceConfig {
	tabName: string;
	parallelLimit: number;
	sheetHeaders: SheetDataHeaders;
}

export class BoxTariffsSheetsService {
	private readonly auth: JWT;
	private spreadsheets: GoogleSpreadsheet[] = [];

	constructor(
		private dbService: BoxTariffsDatabaseService,
		private config: BoxTarrifsSheetsServiceConfig,
	) {
		this.auth = new JWT({
			email: envConfig.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: envConfig.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
	}

	public async initializeSpreadsheets(ids: string[]): Promise<void> {
		// use pLimit to prevent http 429, so requests are being fired in chunks
		const limit = pLimit(this.config.parallelLimit);

		await Promise.all(
			ids.map((id) =>
				limit(async () => {
					const doc = new GoogleSpreadsheet(id, this.auth);
					await doc.loadInfo();
					this.spreadsheets.push(doc);
				}),
			),
		);
	}

	public async syncSpreadsheetsWithDb(): Promise<void> {
		const relevantTarrifs = await this.dbService.getTariff(getToday());
		await this.syncSpreadsheetsWithData(relevantTarrifs, getToday());
	}

	public async syncSpreadsheetsWithData(boxTariff: BoxTariffType, date: string): Promise<void> {
		const { headers, rows } = boxTariffToSheetData(boxTariff, date, this.config.sheetHeaders);

		const limit = pLimit(this.config.parallelLimit);

		await Promise.all(
			this.spreadsheets.map((doc) =>
				limit(async () => {
					let sheet = doc.sheetsByTitle[this.config.tabName];

					if (!sheet) {
						sheet = await doc.addSheet({ title: this.config.tabName });
					}

					await sheet.clear();
					await sheet.setHeaderRow(headers);
					await sheet.addRows(rows);
				}),
			),
		);
	}
}
