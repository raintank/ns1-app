'use strict';

System.register(['angular'], function (_export, _context) {
  "use strict";

  var angular;
  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }],
    execute: function () {

      angular.module('grafana.directives').directive("ns1NewTask", function ($compile) {
        return {
          scope: {
            task: "="
          },
          link: function link(scope, element, attrs) {
            // jshint unused:false
            var template = "";
            if (scope.task.type === "zone") {
              template = "<span>Zone: {{task.zone}}</span>";
            } else if (scope.task.type === "monitoring") {
              template = "<span>Monitoring Job: {{task.name}}</span>";
            }
            element.html(template);
            $compile(element.contents())(scope);
          }
        };
      });
    }
  };
});
//# sourceMappingURL=new_task.js.map
