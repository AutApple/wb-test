import { BoxTariffDTO, BoxTariffType } from '../dto/box-tariff.dto.js';
function dateToLocaleString(val: Date): string {
	return val.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function mapRowsToBoxTarrif(rows: any[]): BoxTariffType {
	return BoxTariffDTO.parse({
		dtNextBox: String(rows[0].dt_next_box) ?? '',
		dtTillMax: dateToLocaleString(rows[0].dt_till_max) ?? '',
		warehouseList: rows.map((row) => ({
			warehouseName: row.warehouse_name,
			geoName: row.geo_name,
			boxDeliveryBase: String(row.box_delivery_base),
			boxDeliveryLiter: String(row.box_delivery_liter),
			boxDeliveryCoefExpr: String(row.box_delivery_coef_expr),
			boxDeliveryMarketplaceBase: String(row.box_delivery_marketplace_base),
			boxDeliveryMarketplaceLiter: String(row.box_delivery_marketplace_liter),
			boxDeliveryMarketplaceCoefExpr: String(row.box_delivery_marketplace_coef_expr),
			boxStorageBase: String(row.box_storage_base),
			boxStorageLiter: String(row.box_storage_liter),
			boxStorageCoefExpr: String(row.box_storage_coef_expr),
		})),
	});
}
