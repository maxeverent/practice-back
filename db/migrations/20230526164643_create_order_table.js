/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('order', function (table) {
            table.increments('id');
            table.string('date', 255).notNullable();
            table.boolean('status');
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
        .dropTable('order');
};
