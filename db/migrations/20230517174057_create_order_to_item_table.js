/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('order_to_item', function (table) {
            table.increments('id');
            table.integer('order_id').unsigned();
            table.foreign('order_id').references('id').inTable('order');
            table.integer('order_item_id').unsigned();
            table.foreign('order_item_id').references('id').inTable('order_item');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('order_to_item');
};
