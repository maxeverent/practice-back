/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('order_item', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.integer('count').notNullable();
            table.string('price').notNullable();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('id').inTable('user');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('order_item');
};