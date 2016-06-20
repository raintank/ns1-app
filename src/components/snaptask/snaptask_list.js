
function slugify(str) {
	var slug = str.replace("@", "at").replace("&", "and").replace(".", "_").replace("/\W+/", "");
	return slug;
}

class SnapTaskListCtrl {
  constructor($scope, $injector, backendSrv) {
  	this.backendSrv = backendSrv;
    this.pageReady = false;
    this.tasks = [];

    this.getTasks();
  }

  getTasks() {
    var self = this;
    return this.backendSrv.get("api/plugin-proxy/ns1-app/tasks", {metric: "/raintank/apps/ns1/*"})
    .then((resp) => {
      if (resp.body.length > 0 ){
        self.tasks = resp.body;
      }
			self.pageReady = true;
    });
  }

  removeTask(task) {
  	var self = this;
    return this.backendSrv.delete("api/plugin-proxy/ns1-app/tasks/"+task.id).then((resp) => {
      //remove task from taskList
      self.getTasks();
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

  getType(task) {
  	if (task.name.substring(0,14) === "ns1-monitoring") {
  		return "monitoringJob";
  	}
		if (task.name.substring(0,8) === "ns1-zone") {
  		return "zone";
  	}
  	return "";
  }

  taskDashboard(task) {
  	var type =this.getType(task)
  	if ( type === "monitoringJob") {
  		return "dashboard/db/ns1-monitors?&var-monitor=" + slugify(task.config['/raintank/apps/ns1'].jobName);
  	} else if (type == "zone") {
  		return "dashboard/db/ns1-zones?&var-zone=" + slugify(task.config['/raintank/apps/ns1'].zone);
  	}
  }

  taskLabel(task) {
  	var type =this.getType(task)
  	if ( type === "monitoringJob") {
  		return "Monitoring Job: "+ task.config['/raintank/apps/ns1'].jobName;
  	} else if (type == "zone") {
  		return "Zone: "+ task.config['/raintank/apps/ns1'].zone;
  	}
  }
}

SnapTaskListCtrl.templateUrl = 'public/plugins/ns1-app/components/snaptask/partials/snaptask_list.html';
export {SnapTaskListCtrl};
