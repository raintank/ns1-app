import _ from 'lodash';

class SnapTaskAddCtrl {
  constructor($scope, $injector, $location, backendSrv) {
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.pageReady = true;
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
    })
  }

  addTask() {
    if (this.taskType == "zone") {
      this.queuedTask.push({
        type: "zone",
        zone: this.newTask.zone
      });
    }
    if (this.taskType == "monitor") {
      this.queuedTask.push({
        type: "monitoring",
        jobId: this.newTask.job.id,
        name: this.newTask.job.name,
      });
    }
    this.newTask = {};
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
    var promises = [];
    _.forEach(this.queuedTask, function(task) {
      if (task.type === "zone") {
        promises.push(self.addZoneTask(task.zone));
      }
      if (task.type === "monitoring") {
        promises.push(self.addMonitorTask(task.jobId, task.name));
      }
    });

    Promise.all(promises).then(()=>{
      self.$location.url("plugins/ns1-app/page/list-tasks");
    }, (resp)=>{
      console.log("failed to add all tasks.", resp);
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
      "enabled": false
    };

    return this.backendSrv.post("api/plugin-proxy/ns1-app/tasks", task);
  }
  addMonitorTask(jobId, jobName) {
    var taskName = "ns1-monitoring-"+jobId;
    var task = {
      "name": "ns1-monitoring-"+jobId,
      "metrics": {"/raintank/apps/ns1/monitoring/*":0},
      "config": {
        "/raintank/apps/ns1": {
          "ns1_key": this.ns1Token,
          "jobId": jobId,
          "jobName": jobName,
        }
      },
      "interval": 300,
      "route": { "type": "any"},
      "enabled": false
    };

    return this.backendSrv.post("api/plugin-proxy/ns1-app/tasks", task);
  }
}

SnapTaskAddCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_add.html';
export {SnapTaskAddCtrl};
