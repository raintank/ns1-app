import configTemplate from './config.html!text';

class Ns1ConfigCtrl {
  constructor($scope, $injector, backendSrv) {
    this.backendSrv = backendSrv;
    this.appModel.secureJsonData = {
      ns1_token: '',
      gnet_token: ''
    };
    this.error = false;
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
  }

  postUpdate() {
  	var self = this;
    if (!this.appModel.enabled) {
      return Promise.resolve();
    }
    // make sure our Api key works.
    return this.backendSrv.get("api/plugin-proxy/raintank-ns1-app/api/account/settings")
    .then((resp) => {
      return ensureTask(resp.customerid).then(()=> {
        return this.appEditCtrl.importDashboards(); 
      });
    }, () => {
      console.log("failed to query NS1 API.");
    	self.error = "Unable to query NS1 API. please re-enter API Key";
    })
  }

  ensureTask(customerid) {
    var self = this;
    
  }
}

Ns1ConfigCtrl.template = configTemplate;

export {
  Ns1ConfigCtrl as ConfigCtrl
};

