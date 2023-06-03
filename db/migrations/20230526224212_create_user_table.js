/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('user', function (table) {
            table.increments('id');
            table.string('fname', 255).notNullable();
            table.string('sname', 255).notNullable();
            table.string('lname', 255).notNullable();
            table.boolean('is_selected');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('user');
};
