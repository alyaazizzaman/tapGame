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
}