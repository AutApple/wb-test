import z from 'zod';
// using zod to validate output and make everything type safe
export const OutputTarrifDTO = z.object({
    dtNextBox: z.string(),
    dtTillMax: z.string(),
    warehouseList: z.array(
        z.object({
            boxDeliveryBase: z.string(),
            boxDeliveryCoefExpr: z.string(),
            boxDeliveryLiter: z.string(),
            boxDeliveryMarketplaceBase: z.string(),
            boxDeliveryMarketplaceCoefExpr: z.string(),
            boxDeliveryMarketplaceLiter: z.string(),
            boxStorageBase: z.string(),
            boxStorageCoefExpr: z.string(),
            boxStorageLiter: z.string(),
            geoName: z.string(),
            warehouseName: z.string()
        })
    )
});

export type OutputTarrifDTOType = z.infer<typeof OutputTarrifDTO>;