import configTemplate from './config.html!text';
import _ from 'lodash';

class Ns1ConfigCtrl {
  constructor($scope, $injector, backendSrv) {
    this.backendSrv = backendSrv;
    this.appModel.secureJsonData = {};
    if (this.appModel.jsonData === null) {
      this.appModel.jsonData = {
        gnetTokenSet: false,
        ns1Token: null,
      };
    }
    this.error = false;
    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    var self = this;
    if (this.appModel.enabled) { // jshint unused:false
      this.getCustomerId().then((resp) => {}, () => {

        // if we cant get the customerId, then we need to re-enter the ns1Token.
        self.appModel.jsonData.ns1Token = null;
        self.error = "invalid NS1 apiKey. Please update the key.";
      });
    }
  }

  preUpdate() {
    if (this.appModel.secureJsonData.gnet_token) {
      this.appModel.jsonData.gnetTokenSet = true;
    }
    return this.initDatasource();
  }

  postUpdate() {
    var self = this;
    if (!this.appModel.enabled) {
      return Promise.resolve();
    }
    // make sure our Api key works.
    return this.getCustomerId()
    .then((resp) => { // jshint unused:false
      return this.appEditCtrl.importDashboards();
    }, () => {
      console.log("failed to query NS1 API.");
      self.error = "Unable to query NS1 API. please re-enter API Key";
      self.appModel.jsonData.ns1Token = null;
    });
  }

  getCustomerId() {
    return this.backendSrv.get("api/plugin-proxy/ns1-app/ns1/account/settings");
  }

  initDatasource() {
    var self = this;
    //check for existing datasource.
    return self.backendSrv.get('api/datasources').then(function(results) {
      var foundGraphite = false;
      var foundElastic = false;
      _.forEach(results, function(ds) {
        if (foundGraphite && foundElastic) { return; }
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
}

Ns1ConfigCtrl.template = configTemplate;

export {
  Ns1ConfigCtrl as ConfigCtrl
};
