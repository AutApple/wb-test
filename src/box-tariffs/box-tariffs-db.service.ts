import { Knex } from 'knex';
import { BoxTariffDTO, BoxTariffType } from './dto/box-tariff.dto.js';
import { mapRowsToBoxTarrif } from './mappers/box-tariff.maper.js';
import { emptyStringToNull, parseDecimal } from './utils/formatting.utils.js';


export class BoxTariffsDatabaseService {
    constructor(private dbClient: Knex) { }

    
    public async getTarrif(date: string): Promise<BoxTariffType> {
        const rows = await this.dbClient('tariffs_box').where({ date });

        if (rows.length === 0) {
            throw new Error(`No tariff found for date: ${date}`);
        }

        return mapRowsToBoxTarrif(rows);
    }

    public async upsertTarrif(tarrif: BoxTariffType, date: string): Promise<void> {
        await Promise.all(
            tarrif.warehouseList.map((warehouse) =>
                this.dbClient('tariffs_box')
                    .insert({
                        date,
                        warehouse_name: warehouse.warehouseName,
                        geo_name: warehouse.geoName,
                        box_delivery_base: parseDecimal(warehouse.boxDeliveryBase),
                        box_delivery_liter: parseDecimal(warehouse.boxDeliveryLiter),
                        box_delivery_coef_expr: parseDecimal(warehouse.boxDeliveryCoefExpr),
                        box_delivery_marketplace_base: parseDecimal(warehouse.boxDeliveryMarketplaceBase),
                        box_delivery_marketplace_liter: parseDecimal(warehouse.boxDeliveryMarketplaceLiter),
                        box_delivery_marketplace_coef_expr: parseDecimal(warehouse.boxDeliveryMarketplaceCoefExpr),
                        box_storage_base: parseDecimal(warehouse.boxStorageBase),
                        box_storage_liter: parseDecimal(warehouse.boxStorageLiter),
                        box_storage_coef_expr: parseDecimal(warehouse.boxStorageCoefExpr),

                        dt_next_box: emptyStringToNull(tarrif.dtNextBox),
                        dt_till_max: emptyStringToNull(tarrif.dtTillMax),

                        updated_at: this.dbClient.fn.now(),
                    })
                    .onConflict(['date', 'warehouse_name'])
                    .merge()
            )
        );
    }
}
