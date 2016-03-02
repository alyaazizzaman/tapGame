'use strict';

angular.module('tapGame')
	.factory('authInterceptor', ['$q','$window' , authInterceptor]);

	function authInterceptor($q, $window) {

		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
        	config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      	}
      		return config;
    	},
    	response: function (response) {
      	if (response.status === 401) {
        	// handle the case where the user is not authenticated
        	console.log('You are not worthy!!');
      	}
      	return response || $q.when(response);
    	}
  	};
  }
