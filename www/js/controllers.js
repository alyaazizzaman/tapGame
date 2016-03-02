'use strict';

angular.module('tapGame')
  .controller('MainCtrl', ['gameSrc', '$window', '$location', MainCtrl]);

function MainCtrl( gameSrc, $window, $location) {

	var vm = this;
  vm.userScore = $location.search().score;
  //trying to reset after every new game.
  $location.search().score = 0;
  $window.sessionStorage = {};
  $window.sessionStorage.id = null;

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
        $window.sessionStorage.token = user.data.token;
        $window.sessionStorage.id = user.data.user.id;
      })
      .catch(function(err) {
        console.log(err);
      });
  };

 
 
  vm.getHighScores = function(){
    console.log($window.sessionStorage.token);
    gameSrc
      .getHighScores()
      .then(function(response) {
        vm.highScores = response.data;
      });
  };

  vm.submitScore = function(id) {
    gameSrc
      .submitScore(id, vm.userScore)
      .then(function(response){
        console.log(response);
      });
  };

}
