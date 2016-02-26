
'use strict';

angular.module('tapGame.controllers', ['ionic'])

.controller('MainCtrl', function($scope, $http) {

	var vm = this;

	vm.signUp = function(userName, email, password) {
		$http({
			url : 'http://localhost:3000/users',
			method: 'POST',
			data : {
				"user_name" : userName,
				"email" : email,
				"password" : password
			}
		});
	};
})

.controller('GameCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


});
