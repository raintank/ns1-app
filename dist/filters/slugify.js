'use strict';

System.register(['angular'], function (_export, _context) {
  "use strict";

  var angular;
  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }],
    execute: function () {

      angular.module('grafana.directives').filter('ns1Slugify', function () {
        return function (str) {
          if (str) {
            return str.replace(".", "_");
          }
          return str;
        };
      });
    }
  };
});
//# sourceMappingURL=slugify.js.map
