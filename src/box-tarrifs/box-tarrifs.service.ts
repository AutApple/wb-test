import z from 'zod';
import envConfig from '../config/env.config.js';
import { OutputTarrifDTO, OutputTarrifDTOType } from './dto/output-tarrif.dto.js';

export class BoxTarrifsService {
    constructor () {}
        
    private getDay(): string {
        const now = Date.now();
        const date = new Date(now);
        return date.toISOString().split('T')[0];
    }

    public async fetchToday(): Promise<OutputTarrifDTOType> {
        const response = await fetch(`https://common-api.wildberries.ru/api/v1/tariffs/box?date=${this.getDay()}`, {
            headers: {
                'Authorization': `${envConfig.WB_API_KEY}`
            }
        });
        
        if (!response.ok) {
            const errorContentText = await response.text();
            throw new Error(errorContentText);
        }

        const responseJson = await response.json();
 
        const parsedTarrif = OutputTarrifDTO.safeParse(responseJson.response?.data);
        
        if (!parsedTarrif.success) {
            const err = z.treeifyError(parsedTarrif.error).errors;
            throw new Error(err.join('\n'));
        }
        return parsedTarrif.data;
    }
}