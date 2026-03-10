import { SheetDataHeaders } from '../box-tariffs/mappers/box-tariff-to-sheet-data.mapper.js';

export interface WBTestConfiguration {
	intervalMin: number;
	parallelChunkSizeLimit: number;
	sheetIds: string[];
	tabName: string;
	defaultSheetHeaders: SheetDataHeaders;
}

// singleton application configuration
export const appConfiguration: WBTestConfiguration = {
	intervalMin: 60, // Tarrif data update interval in minutes
	parallelChunkSizeLimit: 10, // How many sheet updates to do in parallel (this limit exists to prevent HTTP 429)
	sheetIds: [
		// Google spreadsheet ids
		'1sytYVJrki8-yt3AjoGLxKvbvmrdvFt1lHrqBPe7NNOE',
	],
	tabName: 'stocks_coefs', // Name of a google tab
	defaultSheetHeaders: {
		// Sheet headers config
		warehouseName: 'Склад',
		geoName: 'Регион',
		boxDeliveryBase: 'Доставка база',
		boxDeliveryLiter: 'Доставка литр',
		boxDeliveryCoefExpr: 'Коэф доставки',
		boxDeliveryMarketplaceBase: 'Доставка маркет база',
		boxDeliveryMarketplaceLiter: 'Доставка маркет литр',
		boxDeliveryMarketplaceCoefExpr: 'Коэф доставки маркет',
		boxStorageBase: 'Хранение база',
		boxStorageLiter: 'Хранение литр',
		boxStorageCoefExpr: 'Коэф хранения',
		date: 'Дата',
		dtTillMax: 'Тариф до',
	},
};
