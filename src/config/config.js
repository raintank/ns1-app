import configTemplate from './config.html!text';

class Ns1ConfigCtrl {
  constructor($scope, $injector, backendSrv) {
    this.backendSrv = backendSrv;
    this.appModel.secureJsonData = {};
    if (this.appModel.jsonData === null) {
      this.appModel.jsonData = {
        gnetTokenSet: false,
        ns1TokenSet: false,
      };
    }
    this.taskStatus = "Task status unknown";
    this.task = {};
    this.error = false;
    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    var self = this;
    if (this.appModel.enabled) {
      this.getCustomerId().then((resp) => {
        var taskName = self.taskName(resp.customerid);
        self.getTask(taskName).then((exists) => {
          if (!exists) {
            self.appModel.jsonData.ns1TokenSet = false;
            self.error = "Please re-enter NS1 apiKey and hit update to create the task.";
          }
        });
      }, () => {
        // if we cant get the customerId, then we need to re-enter the ns1Token.
        self.appModel.jsonData.ns1TokenSet = false;
        self.error = "invalid NS1 apiKey. Please update the key.";
      });
    }
  }

  preUpdate() {
    if (this.appModel.secureJsonData.ns1_token) {
      this.appModel.jsonData.ns1TokenSet = true;
    }
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
    if (!this.appModel.jsonData.ns1TokenSet) {
      return Promise.resolve();
    }
    // make sure our Api key works.
    return this.getCustomerId()
    .then((resp) => {
      var p = self.ensureTask(resp.customerid, self.appModel.secureJsonData.ns1_token);
      p.then(() => {
        return this.appEditCtrl.importDashboards(); 
      }, () => {
        console.log("failed to add task.");
        self.appModel.enabled = false;
        self.error = "Unable to add collector task. Please try again.";
        self.appModel.jsonData.ns1TokenSet = false;
      });
      return p;
    }, () => {
      console.log("failed to query NS1 API.");
    	self.error = "Unable to query NS1 API. please re-enter API Key";
      self.appModel.jsonData.ns1TokenSet = false;
    });
  }

  getCustomerId() {
    return this.backendSrv.get("api/plugin-proxy/raintank-ns1-app/ns1/account/settings");
  }

  taskName(customerid) {
    return "NS1-" + customerid;
  }

  ensureTask(customerid, ns1Token) {
    if (!ns1Token) {
      return Promise.reject("ns1 token not set.");
    }
    var self = this;
    var taskName = this.taskName(customerid);
    return this.getTask(taskName).then((exists) => {
      if (exists) {
        self.taskStatus = "Task exists.";
        return;
      }
      var task = {
        "name": taskName,
        "metrics": {"/raintank/apps/ns1/*":0},
        "config": {
          "/raintank/apps/ns1": {
            "ns1_key": ns1Token
          }
        },
        "interval": 60,
        "route": { "type": "any"},
        "enabled": true
      };

      var p = self.backendSrv.post("api/plugin-proxy/raintank-ns1-app/tasks", task)
      p.then((resp) => {
        this.task = resp.body;
        self.taskStatus = "Task created.";
      });
      return p;
    });
  }

  getTask(taskName) {
    var self = this;
    return this.backendSrv.get("api/plugin-proxy/raintank-ns1-app/tasks", {metric: "/raintank/apps/ns1/*", name: taskName})
    .then((resp) => {
      //console.log(resp);
      if (resp.body.length > 0 ){
        self.task = resp.body[0];
        self.taskStatus = "Task exists.";
        return true;
      }
      return false;
    });
  }

  stopTask() {
    this.appModel.jsonData.ns1TokenSet=false;
    if (!this.task) {
      console.log("unknown task name.");
      return;
    }
    return this.backendSrv.delete("api/plugin-proxy/raintank-ns1-app/tasks/"+this.task.id).then((resp) => {
      this.task = {};
      this.taskStatus = "Task not found.";
    });
  }

  resetNs1Token() {
    this.appModel.jsonData.ns1TokenSet=false;
    this.task = {};
    this.taskStatus = "Task status unknown."
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
          url: 'api/plugin-proxy/raintank-ns1-app/graphite',
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
          url: 'api/plugin-proxy/raintank-ns1-app/elasticsearch',
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

