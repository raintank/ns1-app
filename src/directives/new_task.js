import angular from 'angular';

angular.module('grafana.directives').directive("ns1NewTask", function($compile) {
  return {
    scope: {
      task: "="
    },
    link: function(scope, element, attrs) { // jshint unused:false
      var template = "";
      if (scope.task.type === "zone") {
        template = "<span>Zone: {{task.zone}}</span>";
      } else if (scope.task.type === "monitoring") {
        template= "<span>Monitoring Job: {{task.name}}</span>";
      }
      element.html(template);
      $compile(element.contents())(scope);
    }
  };
});
