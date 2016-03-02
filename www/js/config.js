'use strict';

angular.module('tapGame')
	.config(configure);
	
	function configure($httpProvider) {
  	$httpProvider.interceptors.push('authInterceptor');
	}

