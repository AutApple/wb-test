import z from 'zod';
import envConfig from '../config/env.config.js';
import { BoxTarrifDTO, BoxTarrifType } from './dto/box-tarrif.dto.js';
import { getDay } from '../utils/date.utils.js';

export class BoxTarrifsApiService {
    constructor () {}
        

    public async fetchToday(): Promise<BoxTarrifType> {
        const response = await fetch(`https://common-api.wildberries.ru/api/v1/tariffs/box?date=${getDay()}`, {
            headers: {
                'Authorization': `${envConfig.WB_API_KEY}`
            }
        });
        
        if (!response.ok) {
            const errorContentText = await response.text();
            throw new Error(errorContentText);
        }

        const responseJson = await response.json();
 
        const parsedTarrif = BoxTarrifDTO.safeParse(responseJson.response?.data);
        
        if (!parsedTarrif.success) {
            const err = z.treeifyError(parsedTarrif.error).errors;
            throw new Error(err.join('\n'));
        }
        return parsedTarrif.data;
    }
}