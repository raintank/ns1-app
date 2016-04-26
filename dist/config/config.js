"use strict";

System.register(["./config.html!text"], function (_export, _context) {
  var configTemplate, _createClass, Ns1ConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_configHtmlText) {
      configTemplate = _configHtmlText.default;
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

      _export("ConfigCtrl", Ns1ConfigCtrl = function () {
        function Ns1ConfigCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, Ns1ConfigCtrl);

          this.backendSrv = backendSrv;
          this.appModel.secureJsonData = {};
          if (this.appModel.jsonData === null) {
            this.appModel.jsonData = {
              gnetTokenSet: false,
              ns1TokenSet: false
            };
          }
          this.taskStatus = "Task not found";
          this.task = {};
          this.error = false;
          this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
          this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
          var self = this;
          if (this.appModel.enabled) {
            this.getCustomerId().then(function (resp) {
              var taskName = self.taskName(resp.customerid);
              self.getTask(taskName).then(function (exists) {
                if (!exists) {
                  self.appModel.jsonData.ns1TokenSet = false;
                  self.error = "Please re-enter NS1 apiKey and hit update to create the task.";
                }
              });
            }, function () {
              // if we cant get the customerId, then we need to re-enter the ns1Token.
              self.appModel.jsonData.ns1TokenSet = false;
              self.error = "invalid NS1 apiKey. Please update the key.";
            });
          }
        }

        _createClass(Ns1ConfigCtrl, [{
          key: "preUpdate",
          value: function preUpdate() {
            if (this.appModel.secureJsonData.ns1_token) {
              this.appModel.jsonData.ns1TokenSet = true;
            }
            if (this.appModel.secureJsonData.gnet_token) {
              this.appModel.jsonData.gnetTokenSet = true;
            }
            return this.initDatasource();
          }
        }, {
          key: "postUpdate",
          value: function postUpdate() {
            var _this = this;

            var self = this;
            if (!this.appModel.enabled) {
              return Promise.resolve();
            }
            // make sure our Api key works.
            return this.getCustomerId().then(function (resp) {
              var p = self.ensureTask(resp.customerid);
              p.then(function () {
                return _this.appEditCtrl.importDashboards();
              }, function () {
                console.log("failed to add task.");
                self.appModel.enabled = false;
                self.error = "Unable to add collector task. Please try again.";
                self.appModel.jsonData.ns1TokenSet = false;
              });
              return p;
            }, function () {
              console.log("failed to query NS1 API.");
              self.error = "Unable to query NS1 API. please re-enter API Key";
              self.appModel.jsonData.ns1TokenSet = false;
            });
          }
        }, {
          key: "getCustomerId",
          value: function getCustomerId() {
            return this.backendSrv.get("api/plugin-proxy/raintank-ns1-app/ns1/account/settings");
          }
        }, {
          key: "taskName",
          value: function taskName(customerid) {
            return "NS1-" + customerid;
          }
        }, {
          key: "ensureTask",
          value: function ensureTask(customerid) {
            var _this2 = this;

            var self = this;
            var taskName = this.taskName(customerid);
            return this.getTask(taskName).then(function (exists) {
              if (exists) {
                self.taskStatus = "Task not created";
                return;
              }
              var task = {
                "name": taskName,
                "metrics": { "/raintank/apps/ns1/*": 0 },
                "config": {
                  "/raintank/apps/ns1": {
                    "ns1_key": self.appModel.secureJsonData.ns1_token
                  }
                },
                "interval": 60,
                "route": { "type": "any" },
                "enabled": true
              };

              var p = self.backendSrv.post("/api/plugin-proxy/raintank-ns1-app/tasks", task);
              p.then(function (resp) {
                _this2.task = resp.body;
                self.taskStatus = "Task running";
              });
              return p;
            });
          }
        }, {
          key: "getTask",
          value: function getTask(taskName) {
            var self = this;
            return this.backendSrv.get("/api/plugin-proxy/raintank-ns1-app/tasks", { metric: "/raintank/apps/ns1/*", name: taskName }).then(function (resp) {
              console.log(resp);
              if (resp.body.length > 0) {
                self.task = resp.body[0];
                self.taskStatus = "Task running";
                return true;
              }
              return false;
            });
          }
        }, {
          key: "stopTask",
          value: function stopTask() {
            var _this3 = this;

            if (!this.task) {
              console.log("unknown task name.");
              return;
            }
            return this.backendSrv.delete("/api/plugin-proxy/raintank-ns1-app/tasks/" + this.task.id).then(function (resp) {
              _this3.task = {};
              _this3.taskStatus = "Task not found";
            });
          }
        }, {
          key: "initDatasource",
          value: function initDatasource() {
            var self = this;
            //check for existing datasource.
            return self.backendSrv.get('/api/datasources').then(function (results) {
              var foundGraphite = false;
              var foundElastic = false;
              _.forEach(results, function (ds) {
                if (foundGraphite && foundElastic) {
                  return;
                }
                if (ds.name === "raintank") {
                  foundGraphite = true;
                }
                if (ds.name === "raintankEvents") {
                  foundElastic = true;
                }
              });
              var promises = [];
              if (!foundGraphite) {
                // create datasource.
                var graphite = {
                  name: 'raintank',
                  type: 'graphite',
                  url: 'api/plugin-proxy/raintank-ns1-app/graphite',
                  access: 'direct',
                  jsonData: {}
                };
                promises.push(self.backendSrv.post('/api/datasources', graphite));
              }
              if (!foundElastic) {
                // create datasource.
                var elastic = {
                  name: 'raintankEvents',
                  type: 'elasticsearch',
                  url: 'api/plugin-proxy/raintank-ns1-app/elasticsearch',
                  access: 'direct',
                  database: '[events-]YYYY-MM-DD',
                  jsonData: {
                    esVersion: 1,
                    interval: "Daily",
                    timeField: "timestamp"
                  }
                };
                promises.push(self.backendSrv.post('/api/datasources', elastic));
              }
              return Promise.all(promises);
            });
          }
        }]);

        return Ns1ConfigCtrl;
      }());

      Ns1ConfigCtrl.template = configTemplate;

      _export("ConfigCtrl", Ns1ConfigCtrl);
    }
  };
});
//# sourceMappingURL=config.js.map
