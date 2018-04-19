import Vuex from 'vuex';
import Vue from 'vue';
import moment from 'moment';
import Task from './objects/Task';
import Time from './objects/Time';
import hash from 'object-hash';
import DefaultUserConfig from './config/DefaultUserConfig';
import PersistenceDrivers from './components/PersistenceDrivers.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [],
    times: [],
    taskTaskRelationships: [],
    taskTimeRelationships: [],
    taskStack: [],
    saveHash: '',
    config: DefaultUserConfig
  },
  getters: {
    getConfig: state => state.config,
    getSubTasks: state => id => state.tasks.filter(task => state.taskTaskRelationships.find(relationship =>
      relationship.parent == id && relationship.child == task.id)),
    getTopLevelTasks: state => state.tasks.filter(task => !state.taskTaskRelationships.find(relationship =>
      relationship.child == task.id)),
    getTaskStack: state => state.taskStack.map(stackItem => state.tasks.find(task =>
      task.id == stackItem)),
    getBreadCrumbs: state => id => {
      const path = [state.tasks.find(task => task.id == id)];
      
      let lastId = id;
      while (state.taskTaskRelationships.find(relationship => relationship.child == lastId)) {
        lastId = state.taskTaskRelationships.find(relationship => relationship.child == lastId).parent;
        path.unshift(state.tasks.find(task => task.id == lastId));
      }
      
      return path;
    },
    getTimingForTask: (state, getters) => id => {
      return state.times.filter(time => 
        state.taskTimeRelationships.find(relationship => relationship.child == time.id && relationship.parent == id)
      ).sort((a, b) => a.begin < b.begin)
    },
    getTimingForTaskAsDays: (state, getters) => id => {
      let times = getters.getTimingForTasks(id);
      let days = [];
      times.forEach(time => {
        let beginDate = moment.unix(time.begin).format("ddd, d MMM");
        if(!days.find(day => day.date == beginDate)) {
          days.push({
            date: beginDate,
            times: [time]
          });
        }else{
          days.find(day => day.date == beginDate).times.push(time);
        }
      });

      return days;
    },
    getElapsedTime: sate => id => {
      var elapsed = [];
      var time = sate.times.find(time => time.id == id);
      var diff = new Date().getTime() - time.begin;

      var hours = Math.floor( diff/1000/60/60 );
      var minutes = Math.floor( (diff - (hours*1000*60*60))/1000/60 );
      var seconds = Math.floor( (diff - (minutes*1000*60) - (hours*1000*60*60))/1000 );
      return [String(hours).padStart(2, "0"), String(minutes).padStart(2, "0"), String(seconds).padStart(2, "0")];
    },
    hasActiveTimer: (state, getters) => id => {
      var times = getters.getTimingForTask(id)
      return (times.length > 0 && !times[0].end);
    },
    hasAcitveTimerChildren: (state, getters) => id => {
      var checkSubtasksForTimer = function(id) {
        var subTasks = getters.getSubTasks(id);
        // Check task and children, returning true (and terminating traversal) if something is found
        for(var index = 0; index < subTasks.length; ++index) {
          // Check this task first
          if(getters.hasActiveTimer(subTasks[index].id))
            return true;
          
          // Check any children
          if(checkSubtasksForTimer(subTasks[index].id))
            return true;
        }

        // In this case, nothing was found
        return false;
      }

      return checkSubtasksForTimer(id);
    },
  },
  // Actions may or may not trigger mutations.  
  // Assume all actions may execute asyncronously
  actions: {
    SAVECONFIG: async ({commit, state}) => {
      localStorage.setItem('tasker2-config', JSON.stringify(state.config));
    },
    LOAD: async ({commit, state}) => {
      // Load the config first
      commit('LOADCONFIG');
      
      // Get the data via the driver
      let driver = PersistenceDrivers[state.config.persistenceDriver];
      let loadData = await driver.load();
      commit('LOAD', loadData);
    },
    SAVE: async ({commit, state}) => {
      // TODO: Allow different storage drivers
      // Prepare data
      var saveData = {
        tasks: state.tasks,
        times: state.times,
        taskStack: state.taskStack,
        taskTaskRelationships: state.taskTaskRelationships,
        taskTimeRelationships: state.taskTimeRelationships
      }
      
      var saveDataHash = hash(saveData);
      if(saveDataHash == state.saveHash) {
        // Don't save, no mutation has occured
      }else {
        let driver = PersistenceDrivers[state.config.persistenceDriver];
        await driver.save(saveData);
        state.saveHash = saveDataHash;
      }
    },
    DELETETASK: async ({commit, state}, id) => {
      var task = state.tasks.find(task => task.id == id);
      // Remove from stack
      
      // Delete children tasks recursively
      var getIdsRecursively = function(taskId) {
        var idsToReturn = [taskId];
        state.taskTaskRelationships.forEach(relationship => {
          if(relationship.parent == taskId) {
            var newIds = getIdsRecursively(relationship.child);
            idsToReturn = idsToReturn.concat(newIds);
          }
        });
        return idsToReturn;
      }
      
      var taskIdsToDelete = getIdsRecursively(task.id);
      taskIdsToDelete.forEach(taskId => {
        commit('REMOVEFROMSTACK', taskId);
        commit('DELETETASK', taskId);
      });
      
      // Delete times
      var timeIdsToDelete = []
      state.taskTimeRelationships.forEach(relationship => {
        if(taskIdsToDelete.includes(relationship.parent)) {
          timeIdsToDelete.push(relationship.child);
        }
      });
      timeIdsToDelete.forEach(timeId => {
        commit('DELETETIME', timeId);
      })
      
      // Delete relationships
      state.taskTaskRelationships.forEach(relationship => {
        if(taskIdsToDelete.includes(relationship.parent) || taskIdsToDelete.includes(relationship.child)) {
          commit('DELETETASKTASKRELATIONSHIP', relationship);
        }
      });
      
      state.taskTimeRelationships.forEach(relationship => {
        if(timeIdsToDelete.includes(relationship.child)) {
          commit('DELETETASKTIMERELATIONSHIP', relationship);
        }
      });
    }
  },
  mutations: {
    NEWLOG: (state, payload) => {
      var newTime = new Time(payload.title);
      state.times.push(newTime);
      state.taskTimeRelationships.push({
        parent: payload.taskId,
        child: newTime.id
      });
    },
    LOADCONFIG: (state) => {
      try {
        var loadConfig = JSON.parse(localStorage.getItem('tasker2-config'));
        if(loadConfig) 
        state.config = loadConfig;
        else
        state.config = DefaultUserConfig;
      } catch(err) {
        state.config = DefaultUserConfig;
      }
    },
    DELETETASKTASKRELATIONSHIP: (state, payload) => {
      state.taskTaskRelationships = state.taskTaskRelationships.filter(relationship => relationship.parent != payload.parent && relationship.child != payload.child);
    },
    DELETETASKTIMERELATIONSHIP: (state, payload) => {
      state.taskTimeRelationships = state.taskTimeRelationships.filter(relationship => relationship.parent != payload.parent && relationship.child != payload.child);
    },
    DELETETIME: (state, id) => {
      state.times.splice(satet.times.findIndex(time => time.id == id), 1);
    },
    COMPLETETASK: (state, id) => {
      state.tasks.find(task => task.id == id).completed == new Date().getTime();
    },
    UNCOMPLETETASK: (state, id) => {
      state.tasks.find(task => task.id == id).completed == null;
    },
    DELETETASK: (state, id) => {
      state.tasks = state.tasks.filter(task => task.id != id);
    },
    REMOVEFROMSTACK: (state, id) => {
      state.taskStack.splice(state.taskStack.findIndex(taskId => taskId == id), 1);
    },
    CLEARSTACK: (state) => {
      state.taskStack = [];
    },
    FOCUSTASK: (state, id) => {
      state.taskStack = state.taskStack.filter(thisId => thisId != id);
      state.taskStack.unshift(id);
    },
    NEWTASK: (state, payload) => {
      if ('title' in payload) {
        const newTask = new Task(payload.title);
        state.tasks.push(newTask);
        if ('parent' in payload) {
          state.taskTaskRelationships.push({ parent: payload.parent, child: newTask.id });
        }
      }
    },
    LOAD: (state, loadData) => {
      // Load Tasks
      if('tasks' in loadData)
      loadData.tasks.forEach(loadTask => {
        state.tasks.push(new Task(loadTask));
      });
      
      // Load Times
      if('times' in loadData)
      loadData.times.forEach(loadTime => {
        state.times.push(new Time(loadTime));
      });
      
      // Load Task-Task Relationships
      if('taskTaskRelationships' in loadData)
      loadData.taskTaskRelationships.forEach(loadRelationship => {
        // Prune orphans now
        if(state.tasks.find(task => task.id == loadRelationship.parent) && state.tasks.find(task => task.id == loadRelationship.child)) {
          state.taskTaskRelationships.push(loadRelationship);
        }
      });
      
      // Load Task-Time Relationships
      if('taskTimeRelationships' in loadData)
      loadData.taskTimeRelationships.forEach(loadRelationship => {
        // Prune orphans now
        if(state.tasks.find(task => task.id == loadRelationship.parent) && state.times.find(time => time.id == loadRelationship.child)) {
          state.taskTimeRelationships.push(loadRelationship);
        }
      });
      
      // Load Task Stack
      if('taskStack' in loadData)
      loadData.taskStack.forEach(taskId => {
        if(state.tasks.find(task => task.id == taskId))
        state.taskStack.push(taskId);
      });
      
      var saveData = {
        tasks: state.tasks,
        times: state.times,
        taskStack: state.taskStack,
        taskTaskRelationships: state.taskTaskRelationships,
        taskTimeRelationships: state.taskTimeRelationships
      }
      
      // Generate Save Hash
      state.saveHash = hash(saveData);
    },
  },
});
