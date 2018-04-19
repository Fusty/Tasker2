<template>
  <ul>
    <task-time-log v-for="(time, index) in times" :time="time"></task-time-log>
  </ul>
</template>

<script>
import store from '../store.js';

export default {
  name: 'task-time-logs',
  props: {
    task: Object,
  },
  store,
  computed: {
    times: function() {
        return store.getters.getTimingForTask(this.task.id);
    },
  }
}
</script>