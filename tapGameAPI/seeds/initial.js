
exports.seed = function(knex, Promise){
  return Promise.join(
        // Deletes ALL existing entries
        knex('users').del(),

        // Inserts seed entries
        knex('users').insert({
                //id
                username: 'samthedog', 
                password: '', 
                email: 'email@anEmail.org',
                high_score: 12021
        }),

        knex('users').insert({
                //id
                username: 'hankthechicken', 
                password: '', 
                email: 'hank@email.net',
                high_score: 15431
        }),
        knex('users').insert({
                //id
                username: 'mackthemack', 
                password: '', 
                email: 'mack@mack.ninja',
                high_score: 101823
        })
    )
};