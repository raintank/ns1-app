import angular from 'angular';

angular.module('grafana.directives').filter('ns1Slugify', function() {
  return function(str) {
  	if (str) {
    	return str.replace(".", "_");
    }
    return str;
  };
});
