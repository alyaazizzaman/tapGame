'use strict';

angular.module('tapGame')
  .controller('MainCtrl', ['gameSrc', MainCtrl]);

function MainCtrl(gameSrc) {

	var vm = this;

  vm.user = {};

	vm.signUp = function(userName, email, password) {
    gameSrc
      .signUp(userName, email, password)
      .then(function(user){
        vm.user.token = user.data.token;
        vm.user.id = user.data.user[0];
      })
      .catch(function(err){
        console.log(err);
      });
	};

  vm.signIn = function(email, password) {
    gameSrc
      .signIn(email, password)
      .then(function(user) {
        vm.user.token = user.data.token;
        vm.user.id = user.data.user.id;
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  // vm.userScore = $location.search().score;

  vm.getHighScores = function(){
    gameSrc
      .getHighScores()
      .then(function(response) {
        vm.highScores = response.data;
      });
  };


};
