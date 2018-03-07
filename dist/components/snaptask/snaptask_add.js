"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _, _createClass, SnapTaskAddCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
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

      _export("SnapTaskAddCtrl", SnapTaskAddCtrl = function () {
        function SnapTaskAddCtrl($scope, $injector, $q, $location, backendSrv, alertSrv) {
          _classCallCheck(this, SnapTaskAddCtrl);

          this.$q = $q;
          this.$location = $location;
          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.$scope = $scope;
          this.pageReady = true;
          this.creatingTasks = false;
          this.addingZones = false;
          this.error = null;
          this.zones = [];
          this.monitoringJobs = [];
          this.taskType = "";
          this.newTask = {};
          this.queuedTask = [];
          this.ns1Token = null;
          this.getConfig();
          this.getZones();
          this.getMonitoringJobs();
        }

        _createClass(SnapTaskAddCtrl, [{
          key: "cancel",
          value: function cancel() {
            this.queuedTask = [];
            this.newTak = {};
            this.taskType = "";
            window.history.back();
          }
        }, {
          key: "getConfig",
          value: function getConfig() {
            var self = this;
            this.backendSrv.get("api/plugins/ns1-app/settings").then(function (resp) {
              self.ns1Token = resp.jsonData.ns1Token;
              if (self.ns1Token) {
                self.pageReady = true;
              } else {
                self.error = "NS1 Api Key not configured.";
              }
            });
          }
        }, {
          key: "queuedTaskExists",
          value: function queuedTaskExists(t) {
            for (var i = 0; i < this.queuedTask.length; i++) {
              var aQueuedTask = this.queuedTask[i];
              if (aQueuedTask.zone === t.zone) {
                return true;
              }
            }
            return false;
          }
        }, {
          key: "addTask",
          value: function addTask() {
            // make sure a zone was selected
            if (this.newTask.zone === undefined || this.newTask.zone === "") {
              this.$scope.$root.appEvent('alert-error', ['Select a Zone from the dropdown', '']);
              // clear
              this.newTask = {};
              return;
            }
            // check if it already exists in the list
            if (!this.queuedTaskExists(this.newTask)) {
              this.queuedTask.push({
                type: "zone",
                zone: this.newTask.zone
              });
              this.addingZones = true;
            } else {
              this.$scope.$root.appEvent('alert-warning', ['Zone already queued for creation', '']);
            }
            // always clear
            this.newTask = {};
          }
        }, {
          key: "removeQueuedTaskItem",
          value: function removeQueuedTaskItem(t) {
            if (this.queuedTask) {
              this.queuedTask.splice(this.queuedTask.indexOf(t), 1);
              if (this.queuedTask.length === 0) {
                this.addingZones = false;
              }
            }
          }
        }, {
          key: "getZones",
          value: function getZones() {
            var self = this;
            return this.backendSrv.get('api/plugin-proxy/ns1-app/ns1/zones').then(function (resp) {
              self.zones = resp;
            });
          }
        }, {
          key: "getMonitoringJobs",
          value: function getMonitoringJobs() {
            var self = this;
            return this.backendSrv.get('api/plugin-proxy/ns1-app/ns1/monitoring/jobs').then(function (resp) {
              self.monitoringJobs = resp;
            });
          }
        }, {
          key: "create",
          value: function create() {
            var self = this;
            this.creatingTasks = true;
            var promises = [];
            _.forEach(this.queuedTask, function (task) {
              promises.push(self.addZoneTask(task.zone));
            });

            this.$q.all(promises).then(function () {
              console.log("finished creating tasks.");
              self.queuedTask = [];
              self.creatingTasks = false;
              self.addingZones = false;
              self.$location.path("plugins/ns1-app/page/list-tasks");
            }, function (resp) {
              console.log("failed to add all tasks.", resp);
              self.creatingTasks = false;
              self.alertSrv.set("failed to create task", resp, 'error', 10000);
            });
          }
        }, {
          key: "addZoneTask",
          value: function addZoneTask(zone) {
            var _this = this;

            var task = {
              "name": "ns1-zone-" + zone,
              "metrics": { "/raintank/apps/ns1/zones/*": 0 },
              "config": {
                "/raintank/apps/ns1": {
                  "ns1_key": this.ns1Token,
                  "zone": zone
                }
              },
              "interval": 300,
              "route": { "type": "any" },
              "enabled": true
            };

            return this.backendSrv.post("api/plugin-proxy/ns1-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                console.log("request failed.", resp.meta.message);
                return _this.$q.reject(resp.meta.message);
              }
            });
          }
        }]);

        return SnapTaskAddCtrl;
      }());

      SnapTaskAddCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_add.html';

      _export("SnapTaskAddCtrl", SnapTaskAddCtrl);
    }
  };
});
//# sourceMappingURL=snaptask_add.js.map
