/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('selected_user', function (table) {
            table.increments('id');
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
        .dropTable('selected_user');
};