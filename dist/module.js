'use strict';

System.register(['./config/config.js', './components/snaptask/snaptask_list', 'app/plugins/sdk'], function (_export, _context) {
  var ConfigCtrl, SnapTaskListCtrl, loadPluginCss;
  return {
    setters: [function (_configConfigJs) {
      ConfigCtrl = _configConfigJs.ConfigCtrl;
    }, function (_componentsSnaptaskSnaptask_list) {
      SnapTaskListCtrl = _componentsSnaptaskSnaptask_list.SnapTaskListCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/ns1-app/css/ns1.dark.css',
        light: 'plugins/ns1-app/css/ns1.light.css'
      });

      _export('ConfigCtrl', ConfigCtrl);

      _export('SnapTaskListCtrl', SnapTaskListCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
