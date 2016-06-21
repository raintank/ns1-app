'use strict';

System.register(['./config/config.js', './components/snaptask/snaptask_list', './components/snaptask/snaptask_add', 'app/plugins/sdk', './directives/new_task'], function (_export, _context) {
  "use strict";

  var ConfigCtrl, SnapTaskListCtrl, SnapTaskAddCtrl, loadPluginCss;
  return {
    setters: [function (_configConfigJs) {
      ConfigCtrl = _configConfigJs.ConfigCtrl;
    }, function (_componentsSnaptaskSnaptask_list) {
      SnapTaskListCtrl = _componentsSnaptaskSnaptask_list.SnapTaskListCtrl;
    }, function (_componentsSnaptaskSnaptask_add) {
      SnapTaskAddCtrl = _componentsSnaptaskSnaptask_add.SnapTaskAddCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }, function (_directivesNew_task) {}],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/ns1-app/css/ns1.dark.css',
        light: 'plugins/ns1-app/css/ns1.light.css'
      });

      _export('ConfigCtrl', ConfigCtrl);

      _export('SnapTaskListCtrl', SnapTaskListCtrl);

      _export('SnapTaskAddCtrl', SnapTaskAddCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
