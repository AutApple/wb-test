import { BoxTarrifsDatabaseService } from './box-tarrifs-db.service.js';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import envConfig from '../config/env.config.js';
import pLimit from 'p-limit';

export class BoxTarrifsSheetsService {
    private readonly auth: JWT;
    private spreadsheets: GoogleSpreadsheet[] = [];

    constructor(private dbService: BoxTarrifsDatabaseService) {
        this.auth = new JWT({
            email: envConfig.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: envConfig.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    }

    public async initializeSpreadsheets(ids: string[], parallelLimit: number = 10): Promise<void> {
        // use pLimit to prevent http 429, so requests are being fired in chunks
        const limit = pLimit(parallelLimit); 

        await Promise.all(
            ids.map((id) =>
                limit(async () => {
                    const doc = new GoogleSpreadsheet(id, this.auth);
                    await doc.loadInfo();
                    console.log(doc.title);
                }))
        );
    }
}