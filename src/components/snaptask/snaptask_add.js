import _ from 'lodash';

class SnapTaskAddCtrl {
  constructor($scope, $injector, $q, $location, backendSrv, alertSrv) {
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

  cancel() {
    this.queuedTask = [];
    this.newTak = {};
    this.taskType = "";
    window.history.back();
  }

  getConfig() {
    var self = this;
    this.backendSrv.get("api/plugins/ns1-app/settings").then((resp) => {
      self.ns1Token = resp.jsonData.ns1Token;
      if (self.ns1Token) {
        self.pageReady = true;
      } else {
        self.error ="NS1 Api Key not configured.";
      }
    });
  }

  // checks if the zone to be created is already in the list
  queuedTaskExists(t) {
    for (var i = 0; i < this.queuedTask.length; i++) {
      var aQueuedTask = this.queuedTask[i];
      if (aQueuedTask.zone === t.zone) {
        return true;
      }
    }
    return false;
  }
  addTask() {
    // make sure a zone was selected
    if ((this.newTask.zone === undefined) || (this.newTask.zone === "")) {
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
    }
    else {
      this.$scope.$root.appEvent('alert-warning', ['Zone already queued for creation', '']);
    }
    // always clear
    this.newTask = {};
  }

  removeQueuedTaskItem(t) {
    if (this.queuedTask) {
      this.queuedTask.splice(this.queuedTask.indexOf(t), 1);
      if (this.queuedTask.length === 0) {
        this.addingZones = false;
      }
    }
  }

  getZones() {
    var self = this;
    return this.backendSrv.get('api/plugin-proxy/ns1-app/ns1/zones').then((resp) =>{
      self.zones = resp;
    });
  }
  getMonitoringJobs() {
    var self = this;
    return this.backendSrv.get('api/plugin-proxy/ns1-app/ns1/monitoring/jobs').then((resp) =>{
      self.monitoringJobs = resp;
    });
  }

  create() {
    var self = this;
    this.creatingTasks = true;
    var promises = [];
    _.forEach(this.queuedTask, function(task) {
      promises.push(self.addZoneTask(task.zone));
    });

    this.$q.all(promises).then(()=>{
      console.log("finished creating tasks.");
      self.queuedTask = [];
      self.creatingTasks = false;
      self.addingZones = false;
      self.$location.path("plugins/ns1-app/page/list-tasks");
    }, (resp)=>{
      console.log("failed to add all tasks.", resp);
      self.creatingTasks = false;
      self.alertSrv.set("failed to create task", resp, 'error', 10000);
    });
  }

  addZoneTask(zone) {
    var task = {
      "name": "ns1-zone-"+zone,
      "metrics": {"/raintank/apps/ns1/zones/*":0},
      "config": {
        "/raintank/apps/ns1": {
          "ns1_key": this.ns1Token,
          "zone": zone
        }
      },
      "interval": 300,
      "route": { "type": "any"},
      "enabled": true
    };

    return this.backendSrv.post("api/plugin-proxy/ns1-app/tasks", task).then((resp) => {
      if (resp.meta.code !== 200) {
        console.log("request failed.", resp.meta.message);
        return this.$q.reject(resp.meta.message);
      }
    });
  }
}

SnapTaskAddCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_add.html';
export {SnapTaskAddCtrl};
