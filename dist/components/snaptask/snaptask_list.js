"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, SnapTaskListCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function slugify(str) {
    var slug = str.replace("@", "at").replace("&", "and").replace(".", "_").replace("/\W+/", "");
    return slug;
  }

  return {
    setters: [],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("SnapTaskListCtrl", SnapTaskListCtrl = function () {
        function SnapTaskListCtrl($scope, $injector, backendSrv, alertSrv) {
          _classCallCheck(this, SnapTaskListCtrl);

          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.pageReady = false;
          this.tasks = [];

          this.getTasks();
        }

        _createClass(SnapTaskListCtrl, [{
          key: "getTasks",
          value: function getTasks() {
            var self = this;
            return this.backendSrv.get("api/plugin-proxy/ns1-app/tasks", { metric: "/raintank/apps/ns1/*" }).then(function (resp) {
              self.tasks = resp.body;
              self.pageReady = true;
            });
          }
        }, {
          key: "removeTask",
          value: function removeTask(task) {
            var self = this;
            return this.backendSrv.delete("api/plugin-proxy/ns1-app/tasks/" + task.id).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to delete task", resp, 'error', 10000);
              }
              self.getTasks();
            });
          }
        }, {
          key: "stopTask",
          value: function stopTask(task) {
            var self = this;
            task.enabled = false;
            return this.backendSrv.put("api/plugin-proxy/ns1-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to stop task", resp, 'error', 10000);
                self.getTasks();
              }
            });
          }
        }, {
          key: "startTask",
          value: function startTask(task) {
            var self = this;
            task.enabled = true;
            return this.backendSrv.put("api/plugin-proxy/ns1-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to start task", resp, 'error', 10000);
                self.getTasks();
              }
            });
          }
        }, {
          key: "getType",
          value: function getType(task) {
            if (task.name.substring(0, 14) === "ns1-monitoring") {
              return "monitoringJob";
            }
            if (task.name.substring(0, 8) === "ns1-zone") {
              return "zone";
            }
            return "";
          }
        }, {
          key: "taskDashboard",
          value: function taskDashboard(task) {
            var type = this.getType(task);
            if (type === "monitoringJob") {
              return "dashboard/db/ns1-monitors?&var-monitor=" + slugify(task.config['/raintank/apps/ns1'].jobName);
            } else if (type === "zone") {
              return "dashboard/db/ns1-zones?&var-zone=" + slugify(task.config['/raintank/apps/ns1'].zone);
            }
          }
        }, {
          key: "taskLabel",
          value: function taskLabel(task) {
            var type = this.getType(task);
            if (type === "monitoringJob") {
              return "Monitoring Job: " + task.config['/raintank/apps/ns1'].jobName;
            } else if (type === "zone") {
              return "Zone: " + task.config['/raintank/apps/ns1'].zone;
            }
          }
        }]);

        return SnapTaskListCtrl;
      }());

      SnapTaskListCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_list.html';

      _export("SnapTaskListCtrl", SnapTaskListCtrl);
    }
  };
});
//# sourceMappingURL=snaptask_list.js.map
