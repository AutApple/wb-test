import { BoxTariffType } from '../dto/box-tariff.dto.js';

export interface SheetDataHeaders {
	warehouseName: string;
	geoName: string;
	boxDeliveryBase: string;
	boxDeliveryLiter: string;
	boxDeliveryCoefExpr: string;
	boxDeliveryMarketplaceBase: string;
	boxDeliveryMarketplaceLiter: string;
	boxDeliveryMarketplaceCoefExpr: string;
	boxStorageBase: string;
	boxStorageLiter: string;
	boxStorageCoefExpr: string;
	date: string;
	dtTillMax: string;
}

export function boxTariffToSheetData(
	boxTariff: BoxTariffType,
	date: string,
	headersMap: SheetDataHeaders,
): {
	headers: string[];
	rows: string[][];
} {
	const sorted = [...boxTariff.warehouseList].sort(
		(a, b) =>
			parseFloat(a.boxDeliveryCoefExpr.replace(',', '.')) -
			parseFloat(b.boxDeliveryCoefExpr.replace(',', '.')),
	);

	const headers = [
		headersMap.warehouseName,
		headersMap.geoName,
		headersMap.boxDeliveryBase,
		headersMap.boxDeliveryLiter,
		headersMap.boxDeliveryCoefExpr,
		headersMap.boxDeliveryMarketplaceBase,
		headersMap.boxDeliveryMarketplaceLiter,
		headersMap.boxDeliveryMarketplaceCoefExpr,
		headersMap.boxStorageBase,
		headersMap.boxDeliveryLiter,
		headersMap.boxDeliveryCoefExpr,
		headersMap.date,
		headersMap.dtTillMax,
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
		boxTariff.dtTillMax,
	]);
	return {
		headers,
		rows,
	};
}
