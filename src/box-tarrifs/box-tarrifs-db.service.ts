import { Knex } from 'knex';
import { BoxTarrifType } from './dto/box-tarrif.dto.js';


export class BoxTarrifsDatabaseService {
    constructor(private dbClient: Knex) {}
    
    private parseDecimal(val: string): number {
        return parseFloat(val.replace(',', '.'));
    }

    public async upsertTarrif(tarrif: BoxTarrifType, date: string): Promise<void> {
        await Promise.all(
            tarrif.warehouseList.map((warehouse) =>
                this.dbClient('tariffs_box')
                    .insert({
                        date,
                        warehouse_name:                      warehouse.warehouseName,
                        geo_name:                            warehouse.geoName,
                        box_delivery_base:                   this.parseDecimal(warehouse.boxDeliveryBase),
                        box_delivery_liter:                  this.parseDecimal(warehouse.boxDeliveryLiter),
                        box_delivery_coef_expr:              this.parseDecimal(warehouse.boxDeliveryCoefExpr),
                        box_delivery_marketplace_base:       this.parseDecimal(warehouse.boxDeliveryMarketplaceBase),
                        box_delivery_marketplace_liter:      this.parseDecimal(warehouse.boxDeliveryMarketplaceLiter),
                        box_delivery_marketplace_coef_expr:  this.parseDecimal(warehouse.boxDeliveryMarketplaceCoefExpr),
                        box_storage_base:                    this.parseDecimal(warehouse.boxStorageBase),
                        box_storage_liter:                   this.parseDecimal(warehouse.boxStorageLiter),
                        box_storage_coef_expr:               this.parseDecimal(warehouse.boxStorageCoefExpr),
                        dt_next_box:                         tarrif.dtNextBox,
                        dt_till_max:                         tarrif.dtTillMax,
                        updated_at:                          this.dbClient.fn.now(),
                    })
                    .onConflict(['date', 'warehouse_name'])
                    .merge()
            )
        );
    }
}
