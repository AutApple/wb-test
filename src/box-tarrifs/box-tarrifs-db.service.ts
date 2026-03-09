import { Knex } from 'knex';
import { BoxTarrifDTO, BoxTarrifType } from './dto/box-tarrif.dto.js';


export class BoxTarrifsDatabaseService {
    constructor(private dbClient: Knex) { }

    private parseDecimal(val: string): number {
        return parseFloat(val.replace(',', '.').replace('-', '0'));
    }

    private emptyStringToNull(val: string): string | null {
        return val && val.trim() !== '' ? val : null;
    }

    private dateToLocaleString(val: Date): string {
        return val.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
    }

    public async getTarrif(date: string): Promise<BoxTarrifType> {
        const rows = await this.dbClient('tariffs_box').where({ date });

        if (rows.length === 0) {
            throw new Error(`No tariff found for date: ${date}`);
        }

        return BoxTarrifDTO.parse({
            dtNextBox: String(rows[0].dt_next_box) ?? '',
            dtTillMax: this.dateToLocaleString(rows[0].dt_till_max) ?? '',
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

    public async upsertTarrif(tarrif: BoxTarrifType, date: string): Promise<void> {
        await Promise.all(
            tarrif.warehouseList.map((warehouse) =>
                this.dbClient('tariffs_box')
                    .insert({
                        date,
                        warehouse_name: warehouse.warehouseName,
                        geo_name: warehouse.geoName,
                        box_delivery_base: this.parseDecimal(warehouse.boxDeliveryBase),
                        box_delivery_liter: this.parseDecimal(warehouse.boxDeliveryLiter),
                        box_delivery_coef_expr: this.parseDecimal(warehouse.boxDeliveryCoefExpr),
                        box_delivery_marketplace_base: this.parseDecimal(warehouse.boxDeliveryMarketplaceBase),
                        box_delivery_marketplace_liter: this.parseDecimal(warehouse.boxDeliveryMarketplaceLiter),
                        box_delivery_marketplace_coef_expr: this.parseDecimal(warehouse.boxDeliveryMarketplaceCoefExpr),
                        box_storage_base: this.parseDecimal(warehouse.boxStorageBase),
                        box_storage_liter: this.parseDecimal(warehouse.boxStorageLiter),
                        box_storage_coef_expr: this.parseDecimal(warehouse.boxStorageCoefExpr),

                        dt_next_box: this.emptyStringToNull(tarrif.dtNextBox),
                        dt_till_max: this.emptyStringToNull(tarrif.dtTillMax),

                        updated_at: this.dbClient.fn.now(),
                    })
                    .onConflict(['date', 'warehouse_name'])
                    .merge()
            )
        );
    }
}
