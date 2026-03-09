import z from 'zod';
import envConfig from '../config/env.config.js';
import { BoxTariffDTO, BoxTariffType } from './dto/box-tariff.dto.js';
import { getToday } from '../utils/date.utils.js';

export class BoxTariffsApiService {
	constructor() {}

	public async fetchToday(): Promise<BoxTariffType> {
		const response = await fetch(
			`https://common-api.wildberries.ru/api/v1/tariffs/box?date=${getToday()}`,
			{
				headers: {
					Authorization: `${envConfig.WB_API_KEY}`,
				},
			},
		);

		if (!response.ok) {
			const errorContentText = await response.text();
			throw new Error(errorContentText);
		}

		const responseJson = await response.json();

		const parsedTarrif = BoxTariffDTO.safeParse(responseJson.response?.data);

		if (!parsedTarrif.success) {
			const err = z.treeifyError(parsedTarrif.error).errors;
			throw new Error(err.join('\n'));
		}
		return parsedTarrif.data;
	}
}
