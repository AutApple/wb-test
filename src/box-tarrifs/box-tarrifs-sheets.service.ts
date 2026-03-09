import { BoxTarrifsDatabaseService } from './box-tarrifs-db.service.js';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import envConfig from '../config/env.config.js';
import pLimit from 'p-limit';
import { BoxTarrifType } from './dto/box-tarrif.dto.js';
import { getToday } from '../utils/date.utils.js';

export interface BoxTarrifsSheetsServiceConfig {
    tabName: string;
    parallelLimit: number;
}

export class BoxTarrifsSheetsService {
    private readonly auth: JWT;
    private spreadsheets: GoogleSpreadsheet[] = [];

    constructor(private dbService: BoxTarrifsDatabaseService, private config: BoxTarrifsSheetsServiceConfig) {
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
                    console.log(doc.title);
                }))
        );
    }

    // This method can be used if syncing is run as a separate job. 
    // but for the provided task its irrelevant cause it results in N+1 db queries
    // so i use just syncSpreadsheetsWithData in a single job 
    public async syncSpreadsheetsWithDb(): Promise<void> {
        const relevantTarrifs = await this.dbService.getTarrif(getToday());
        await this.syncSpreadsheetsWithData(relevantTarrifs, getToday());
    }

    public async syncSpreadsheetsWithData(boxTarrif: BoxTarrifType, date: string): Promise<void> {
        const sorted = [...boxTarrif.warehouseList].sort(
            (a, b) => parseFloat(a.boxDeliveryCoefExpr.replace(',', '.')) - parseFloat(b.boxDeliveryCoefExpr.replace(',', '.'))
        );

        const headers = [
            'Склад', 'Регион',
            'Доставка база', 'Доставка литр', 'Коэф доставки',
            'Доставка маркет база', 'Доставка маркет литр', 'Коэф доставки маркет',
            'Хранение база', 'Хранение литр', 'Коэф хранения',
            'Дата', 'Тариф до'
        ];

        const rows = sorted.map((w) => [
            w.warehouseName,
            w.geoName,
            w.boxDeliveryBase,
            w.boxDeliveryLiter,
            w.boxDeliveryCoefExpr,
            w.boxDeliveryMarketplaceBase,
            w.boxDeliveryMarketplaceLiter,
            w.boxDeliveryMarketplaceCoefExpr,
            w.boxStorageBase,
            w.boxStorageLiter,
            w.boxStorageCoefExpr,
            date,
            boxTarrif.dtTillMax,
        ]);

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
                })
            )
        );
    }
}