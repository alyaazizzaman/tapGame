var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




// ALL USERS
// router.get('/users', function(req, res, next) {

// 	var data = {};

// 	data = knex('users').select().then(function(data){
// 		res.send(data);
// 	}).catch(function(err){
// 		console.log("Error: ", err);
// 		res.send('There was an error on the server.');
// 	});
  
// });


// USER BY ID
router.get('/users/:id', function(req, res, next) {
	
	var data ={};
	
	data = knex('users').select().where('id', req.params.id).then(function(data){
		res.send(data);
	}).catch(function(err){
		res.send('There was an error on the server.');
	});
});


// NEW
router.post('/', function(req, res, next) {
	var data ={};

	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var high_score = req.body.high_score;

	knex('books').insert({
		username : username,
		password : password,
		email : email,
		high_score : high_score,
		
	}).then(function(countInserted){
		res.send('Added new entry: ', countInserted);
	}).catch(function(err){
		res.send('There was an error on the server.');
	});

});


// DELETE
router.delete('/:id', function(req, res, next) {

	var didDelete = knex('users').where({ id : req.params.id }).del().then(function(success){
		res.send('Delete Successful');
	}).catch(function(err){
		res.send('There was an error on the server.');
	});
});































module.exports = router;
