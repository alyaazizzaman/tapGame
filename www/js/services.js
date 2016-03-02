'use strict';

angular.module('tapGame')
  .service('gameSrc', ['$http', gameSrc]);

function gameSrc($http) {



  this.signUp = function(userName, email, password) {
    return $http({
      url : 'http://localhost:3000/users', //http://fierce-bastion-88682.herokuapp.com
      method: 'POST',
      data : {
        "user_name" : userName,
        "email" : email,
        "password" : password
      }
    });
  };
 

  this.signIn = function(email, password) {
    return $http({
      url : 'http://localhost:3000/users/signin', //http://fierce-bastion-88682.herokuapp.com
      method : 'POST',
      data : {
        "email" : email,
        "password" : password
      }
    });
  };

  this.getHighScores = function(){
    return $http({
      method: 'GET',
      url: 'http://localhost:3000/users/highscores' //http://fierce-bastion-88682.herokuapp.com
    });
  };

  this.submitScore = function(id, score) {

    var config = {
      method: 'PUT',
      url: 'http://localhost:3000/users/' + id,
      data: {
        high_score: score
      }
    };

    config.headers = {};
    
    if ($window.sessionStorage.token) {
      config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
    }

    return $http(config);
  };

}