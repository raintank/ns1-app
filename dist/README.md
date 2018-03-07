[NS1](https://ns1.com) is an intelligent DNS and traffic management platform with a unique Filter Chain™ routing engine. NS1’s technology leverages infrastructure, application and network data to make intelligent routing decisions in real time, ensuring optimal application performance and reliability.

The NS1 Grafana App gives you a real-time view into DNS traffic and monitoring jobs configured within the NS1 platform.

## Requirements
The NS1 app requires a Grafana.com account, [Grafana 3.0](https://grafana.org) (or higher) and an [NS1 account](https://ns1.com/signup?plan=startup). There are no other external dependencies, accounts or configurations needed.

## Features
Give your team a quick view into DNS traffic and infrastructure health. This app provides instant visibility into query-per-second (QPS) traffic and NS1’s built-in high frequency monitoring service.

### Supported metrics
- Queries per second, broken down by zone
- DNS monitoring
- HTTP monitoring
- Ping (ICMP) monitoring
- TCP monitoring
- NS1 monitoring from multiple regions with rapid recheck to prevent false positives

## Getting Help

### Documentation
- [NS1 API](https://ns1.com/api/)
- [NS1 Knowledge Base](http://kb.ns1.com/knowledgebase)

### Feedback and Questions
We would love to hear what you think of this app and if you have any feature requests for future versions. Pleaes submit any issues with the app on [Github](https://github.com/raintank/ns1-app/issues) or [contact us directly](https://ns1.com/about/contact).

### Using the NS1 Application

To use this application there are X steps that need to be taken.

1. Create an API Key on your Grafana.com account with the role Editor.
2. Create an API Key on your NS1 account
3. Configure the application datasources
4. Add a task to monitor your domains
4. View QPS dashboard

#### Setup datasources

Once the application is installed, select the NS1 icon to configure the datasources.

![NS1Config](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_config.png)

Create an API Key with the role Editor using your grafana.com account, and paste into first field.

Create an API Key on your NS1 account and paste into the second field.

Click update and the datasources will be updated and verified they are working.

#### Add a task

Select "Add Task" from the sidebar menu.

![NS1AddTask](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_sidemenu.png)

The following is displayed:
![NS1AddTaskEmpty](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_add_task_empty.png)

Select a zone from the popdown and click "Add". NOTE: It may take a second to load your zones. If you do not see any zones listed in the popdown, check your API Keys.

In this example, we're adding "grafana.com" and "raintank.io":
![NS1AddTaskDropdown](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_add_task_dropdown.png)

The list of zones to be added are shown below the popdown:
![NS1AddTaskItemQueued](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_add_task_item_queued.png)

Add additional zones as needed:
![NS1AddTaskTwoQueued](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_add_task_two_queued.png)

Select "Create" and you will be taken to the "List Tasks" page
![NS1ListTasksAdded](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_list_tasks_added.png)

You can add additional zones by selecting the "+ Add Task" button, or proceed to the QPS Dashboard.

#### QPS dashboard

Once your tasks are created, data will be collected and viewable from the imported dashboard.

![NS1QPSDashboard](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_qps_dashboard_filled.png)

#### Editing tasks

Use the "List Task" menu option to stop/start or remove tasks.

![NS1ListTasks](https://raw.githubusercontent.com/raintank/ns1-app/master/src/img/ns1_app_list_tasks_added.png)
