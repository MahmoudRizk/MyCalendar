
exports.up = function(knex) {
  return knex.schema.createTable('cal_event', function(t) {
        t.increments('id').unsigned().primary();
        t.text('name').nullable();
        t.text('date').nullable();
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('cal_event');
};
