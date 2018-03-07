import {ConfigCtrl} from './config/config.js';
import {SnapTaskListCtrl} from './components/snaptask/snaptask_list';
import {SnapTaskAddCtrl} from './components/snaptask/snaptask_add';
import {loadPluginCss} from 'app/plugins/sdk';
import './directives/new_task';

loadPluginCss({
  dark: 'plugins/ns1-app/css/ns1.dark.css',
  light: 'plugins/ns1-app/css/ns1.light.css'
});

export {
  ConfigCtrl,
  SnapTaskListCtrl,
  SnapTaskAddCtrl
};
