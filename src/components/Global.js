import Vue from 'vue'

// Vue Components
import TaskStack from './TaskStack.vue'
import TaskList from './TaskList.vue'
import TaskListItem from './TaskListItem.vue'
import TaskCard from './TaskCard.vue'
import SubTaskEntry from './SubTaskEntry.vue'
import TaskTimer from './TaskTimer.vue'
import TaskTimeLog from './TaskTimeLog.vue'
import TaskTimeLogs from './TaskTimeLogs.vue'

Vue.component('task-stack', TaskStack);
Vue.component('task-list', TaskList);
Vue.component('task-list-item', TaskListItem);
Vue.component('task-card', TaskCard);
Vue.component('sub-task-entry', SubTaskEntry);
Vue.component('task-timer', TaskTimer);
Vue.component('task-time-log', TaskTimeLog);
Vue.component('task-time-logs', TaskTimeLogs);


// Filters and other global Vue utilities
import VueAutosize from 'vue-autosize'
import {dateFilter} from './Filters.js'
import {truncateFilter} from './Filters.js'

Vue.use(VueAutosize);
Vue.filter('date', dateFilter);
Vue.filter('truncate', truncateFilter);

export default {}