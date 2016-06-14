import {ConfigCtrl} from './config/config.js';
import {SnapTaskListCtrl} from './components/snaptask/snaptask_list';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/ns1-app/css/ns1.dark.css',
  light: 'plugins/ns1-app/css/ns1.light.css'
});

export {
	ConfigCtrl,
	SnapTaskListCtrl
};
