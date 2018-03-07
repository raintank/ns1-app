'use strict';

System.register(['./config.html!text', 'lodash'], function (_export, _context) {
  "use strict";

  var configTemplate, _, _createClass, Ns1ConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_configHtmlText) {
      configTemplate = _configHtmlText.default;
    }, function (_lodash) {
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

      _export('ConfigCtrl', Ns1ConfigCtrl = function () {
        function Ns1ConfigCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, Ns1ConfigCtrl);

          this.backendSrv = backendSrv;
          this.appModel.secureJsonData = {};
          if (this.appModel.jsonData === null) {
            this.appModel.jsonData = {
              gnetTokenSet: false,
              ns1Token: null
            };
          }
          this.error = false;
          this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
          this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
          var self = this;
          if (this.appModel.enabled) {
            // jshint unused:false
            this.getCustomerId().then(function (resp) {}, function () {

              // if we cant get the customerId, then we need to re-enter the ns1Token.
              self.appModel.jsonData.ns1Token = null;
              self.error = "invalid NS1 apiKey. Please update the key.";
            });
          }
        }

        _createClass(Ns1ConfigCtrl, [{
          key: 'preUpdate',
          value: function preUpdate() {
            if (this.appModel.secureJsonData.gnet_token) {
              this.appModel.jsonData.gnetTokenSet = true;
            }
            return this.initDatasource();
          }
        }, {
          key: 'postUpdate',
          value: function postUpdate() {
            var _this = this;

            var self = this;
            if (!this.appModel.enabled) {
              return Promise.resolve();
            }
            // make sure our Api key works.
            return this.getCustomerId().then(function (resp) {
              // jshint unused:false
              return _this.appEditCtrl.importDashboards();
            }, function () {
              console.log("failed to query NS1 API.");
              self.error = "Unable to query NS1 API. please re-enter API Key";
              self.appModel.jsonData.ns1Token = null;
            });
          }
        }, {
          key: 'getCustomerId',
          value: function getCustomerId() {
            return this.backendSrv.get("api/plugin-proxy/ns1-app/ns1/account/settings");
          }
        }, {
          key: 'initDatasource',
          value: function initDatasource() {
            var self = this;
            //check for existing datasource.
            return self.backendSrv.get('api/datasources').then(function (results) {
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
                  url: 'api/plugin-proxy/ns1-app/graphite',
                  access: 'direct',
                  jsonData: {}
                };
                promises.push(self.backendSrv.post('api/datasources', graphite));
              }
              if (!foundElastic) {
                // create datasource.
                var elastic = {
                  name: 'raintankEvents',
                  type: 'elasticsearch',
                  url: 'api/plugin-proxy/ns1-app/elasticsearch',
                  access: 'direct',
                  database: '[events-]YYYY-MM-DD',
                  jsonData: {
                    esVersion: 1,
                    interval: "Daily",
                    timeField: "timestamp"
                  }
                };
                promises.push(self.backendSrv.post('api/datasources', elastic));
              }
              return Promise.all(promises);
            });
          }
        }]);

        return Ns1ConfigCtrl;
      }());

      Ns1ConfigCtrl.template = configTemplate;

      _export('ConfigCtrl', Ns1ConfigCtrl);
    }
  };
});
//# sourceMappingURL=config.js.map
