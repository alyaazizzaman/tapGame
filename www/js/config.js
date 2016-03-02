'use strict';

angular.module('tapGame')
	// .config('configure', ['$httpProvider', configure]);
	.config(configure);
	
	function configure($httpProvider) {
  	$httpProvider.interceptors.push('authInterceptor');
	}

