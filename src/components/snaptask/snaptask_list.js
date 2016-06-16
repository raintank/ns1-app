class SnapTaskListCtrl {
  constructor($scope, $injector, backendSrv) {
  	this.backendSrv = backendSrv;
    this.pageReady = true;
    this.tasks = [];

    this.getTasks();
  }

  getTasks() {
    var self = this;
    return this.backendSrv.get("api/plugin-proxy/ns1-app/tasks", {metric: "/raintank/apps/ns1/*"})
    .then((resp) => {
      //console.log(resp);
      if (resp.body.length > 0 ){
        self.tasks = resp.body;
      }
    });
  }

  removeTask(task) {
    return this.backendSrv.delete("api/plugin-proxy/ns1-app/tasks/"+task.id).then((resp) => {
      //remove task from taskList
    });
  }

  stopTask(task) {
  	task.enabled = false;
    return this.backendSrv.put("api/plugin-proxy/ns1-app/tasks", task);
  }
  startTask(task) {
  	task.enabled = true;
    return this.backendSrv.put("api/plugin-proxy/ns1-app/tasks", task);
  }
}

SnapTaskListCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_list.html';
export {SnapTaskListCtrl};
