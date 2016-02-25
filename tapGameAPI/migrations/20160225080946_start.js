
exports.up = function(knex, Promise) {
  return Promise.all([
        
        knex.schema.createTable('users', function(table)
            {
                table.increments('id');
                table.string('username', 50);
                table.string('password', 50);
                table.string('email', 50);
                table.integer('high_score');
            })
        ]);
};

exports.down = function(knex, Promise) {
   return Promise.all([
      knex.schema.dropTable('users')
  ])
};
