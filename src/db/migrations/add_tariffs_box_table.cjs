exports.up = function (knex) {
  return knex.schema.createTable('tariffs_box', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.text('warehouse_name').notNullable();
    table.text('geo_name').nullable();

    
    table.decimal('box_delivery_base', 10, 2).nullable();
    table.decimal('box_delivery_liter', 10, 2).nullable();
    table.decimal('box_delivery_coef_expr', 10, 2).nullable();

    table.decimal('box_delivery_marketplace_base', 10, 2).nullable();
    table.decimal('box_delivery_marketplace_liter', 10, 2).nullable();
    table.decimal('box_delivery_marketplace_coef_expr', 10, 2).nullable();

    table.decimal('box_storage_base', 10, 4).nullable();
    table.decimal('box_storage_liter', 10, 4).nullable();
    table.decimal('box_storage_coef_expr', 10, 2).nullable();

    table.date('dt_next_box').nullable();
    table.date('dt_till_max').nullable();
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['date', 'warehouse_name']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tariffs_box');
};