'use strict';

angular.module('tapGame.controllers', ['ionic'])

.controller('MainCtrl', function($scope) {


})

.controller('GameCtrl', function($scope, $http) {
  var vm = this;

  vm.getHighScores = function(){
    $http({
      method: 'GET',
      url: 'http://localhost:3000/users/highscores'
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
