'use strict';

System.register(['./config.html!text'], function (_export, _context) {
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

      _export('ConfigCtrl', Ns1ConfigCtrl = function () {
        function Ns1ConfigCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, Ns1ConfigCtrl);

          this.backendSrv = backendSrv;
          this.appModel.secureJsonData = {
            ns1_token: '',
            gnet_token: ''
          };
          this.error = false;
          this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
        }

        _createClass(Ns1ConfigCtrl, [{
          key: 'postUpdate',
          value: function postUpdate() {
            var _this = this;

            var self = this;
            if (!this.appModel.enabled) {
              return Promise.resolve();
            }
            // make sure our Api key works.
            return this.backendSrv.get("api/plugin-proxy/raintank-ns1-app/api/account/settings").then(function (resp) {
              return ensureTask(resp.customerid).then(function () {
                return _this.appEditCtrl.importDashboards();
              });
            }, function () {
              console.log("failed to query NS1 API.");
              self.error = "Unable to query NS1 API. please re-enter API Key";
            });
          }
        }, {
          key: 'ensureTask',
          value: function ensureTask(customerid) {
            var self = this;
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
