<template>
  <div class="row centered-row">
    <div class="width-7">
      <input class="new-task-title big light2" v-if="!activeTime" @keydown.enter="startTimer" v-model="timeTitle" placeholder="What are you logging?"/>
      <input class="new-task-title big danger1" v-if="activeTime" v-model="activeTime.title"/>
    </div>
    <div class="width-5 min-width-17 margin-bottom-1">
      <span class="stopwatch" :class="{'timer-in-progress': Boolean(activeTime)}" v-text="stopwatch"></span>
    </div>
    <div class="width-12 margin-bottom-1">
      <button v-show="activeTime" class="danger1 outline full-width" @click="stopTimer">Stop Timer</button>
      <button v-if="!activeTime && this.times.length > 0" class="light2 outline full-width" @click="restartTimer">Restart Latest Timer ({{ this.times[0].title }})</button>
    </div>
  </div>
</template>

<script>
import store from '../store.js';
import Timing from './mixins/Timing.js'

export default {
  name: 'task-timer',
  props: {
    task: Object,
  },
  store,
  mixins: [Timing],
  data: function(){ return {
    timeTitle: ''
  }},
  methods: {
    stopTimer() {
      this.activeTime.end = new Date().getTime();
    },
    startTimer() {
      if(this.timeTitle != '') {
        store.commit('NEWLOG', {
          title: this.timeTitle,
          taskId: this.task.id
        });
        this.timeTitle = '';
      }
    },
    restartTimer() {
      if(this.times.length > 0) {
        store.commit('NEWLOG', {
          title: this.times[0].title,
          taskId: this.task.id
        });
      }
    },
    updateTime() {
      if(this.activeTime) {
        var elapsed = store.getters.getElapsedTime(this.activeTime.id);
        this.stopwatch = elapsed.join(":");
      }else
        this.stopwatch = "00:00:00";
    },
  },
  computed: {
    days: function() {
      return store.getters.getTimingForTaskAsDays(this.task.id);
    },
  }
}
</script>