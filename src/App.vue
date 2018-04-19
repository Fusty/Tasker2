<template>
  <div id="app">
    <header class="mdl-layout__header">
      <nav class="nav">
        <a href="#" class="logo">Tasker</a>
        <a href="#" class="logo-sm">T</a>
        <div class="title-input">
          <input type="text" id="title-input" class="light1" placeholder="New Task Title . . ." @keydown.enter="addNewTask" v-model="headerTaskTitleInput"/>
        </div>
      </nav>
    </header>
    
    <main>
      <div class="row">
        <!-- LEFT COLUMN -->
        <div class="width-5">
          <task-list :tasks="tasks" :is-list-root="true"></task-list>
        </div>
        <!-- RIGHT COLUMN -->
        <task-stack></task-stack>
      </div>
    </main>
    <footer>Tasker is PRE-ALPHA software and is offered with NO GUARANTEES OF ANY KIND. PREPARE FOR DATA LOSS.</footer>
  </div>
</template>

<script>
import store from './store.js'
import GlobalComponents from './components/Global.js'

export default {
  name: 'vue',
  store,
  data(){return {
    hello: 'world',
    headerTaskTitleInput: '',
  }},
  mounted: async function() {
    await this.load();
    this.save();
  },
  methods: {
    async load() {
      await store.dispatch('LOAD');
    },
    async save() {
      await store.dispatch('SAVE');
      setTimeout(() => {
        this.save();
      }, this.saveIntervalSeconds*1000);
    },
    addNewTask() {
      if(this.headerTaskTitleInput !== '') {
        store.commit('NEWTASK', {title: this.headerTaskTitleInput});
        this.headerTaskTitleInput = '';
      }
    },
  },
  computed: {
    tasks: () => store.getters.getTopLevelTasks,
    config: () => store.state.config,
    saveIntervalSeconds: function() {
      if(this.config && 'saveIntervalSeconds' in this.config)
        return this.config.saveIntervalSeconds;
      else
        return 2;
    }
  }
}
</script>