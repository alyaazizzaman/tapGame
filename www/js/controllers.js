'use strict';

angular.module('tapGame.controllers', ['ionic'])

.controller('MainCtrl', function($scope, $http) {

	var vm = this;

	vm.signUp = function(userName, email, password) {
    $http({
			url : 'http://fierce-bastion-88682.herokuapp.com/users', //http://fierce-bastion-88682.herokuapp.com
			method: 'POST',
			data : {
				"user_name" : userName,
				"email" : email,
				"password" : password
			}
		}).then(function(token){
      console.log(token);
    });

	};

  vm.signIn = function(email, password) {
    console.log(email, password);
    $http({
      url : 'http://fierce-bastion-88682.herokuapp.com/signin', //http://fierce-bastion-88682.herokuapp.com
      method : 'POST',
      data : {
        "email" : email,
        "password" : password
      }
    }).then(function(token){
      console.log(token);
    });
  };
})

.controller('GameCtrl', function($scope, $http, $location) {
  var vm = this;

  vm.userScore = $location.search().score;

  vm.getHighScores = function(){
    $http({
      method: 'GET',
      url: 'http://localhost:3000/users/highscores' //http://fierce-bastion-88682.herokuapp.com
    }).then(function successCallback(response) {
      console.log(response.data);
      vm.highscores = response.data;
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  vm.highscores;

});
