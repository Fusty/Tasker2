<template>
    <div class="task-card">
        <header class="centered-row border-group border-group--horizontal">
            <button class="light1" :class="{grow: tab == 'details', outline: tab != 'details' }" @click="setTab('details')">Task Details</button>
            <button class="light1" :class="{grow: tab == 'times', outline: tab != 'times' }" @click="setTab('times')">Time Logs</button>
            <button class="light1" :class="{grow: tab == 'calendar', outline: tab != 'calendar' }" @click="setTab('calendar')">Task Calendar</button>
        </header>
        <main>
            <div v-show="tab == 'details'">
                <task-list-item :task="task" :task-card-heading="true"></task-list-item>
                <p class="bread-crumbs" v-if="breadCrumbs" v-text="breadCrumbs"></p>
                <textarea class="task-description" v-model="task.description" v-autosize="task.description" placeholder="Enter Task Description . . ."></textarea>
                <!-- TODO: TaskCardTimer -->
                <task-list :show-children="true" :tasks="subTasks" :parent-task="task" :is-list-root="true"></task-list><br/>
                <sub-task-entry :parent-task="task" class="margin-left-0"></sub-task-entry>
                <!-- TODO: Subtask Input -->
            </div>
            <div v-show="tab == 'times'">
                <task-timer :task="task"></task-timer>
                <task-time-logs :task="task"></task-time-logs>
            </div>
            <div v-show="tab == 'calendar'">
                Calendar goes here!
            </div>
        </main>
        <footer class="border-group border-group--horizontal">
            <button v-if="!task.completed" class="grow light2 outline" @click="completeTask()">
                Complete Task
            </button>
            <button v-if="task.completed" class="grow light2 outline" @click="unCompleteTask()">
                Un-Complete Task
            </button>
            <button @click="clearTaskFromStack()" class="grow light1 outline">
                Close Task
            </button>
            <button v-if="!showDelete" class="grow danger1 outline" @click="deleteTask()">
                Delete Task
            </button>
            <button v-if="showDelete" class="grow light1 outline" @click="deleteTaskCancel()">
                Cancel Task Delete
            </button>
            <button v-if="showDelete" class="grow danger1 outline" @click="deleteTaskConfirm()">
                Confirm Task Delete
            </button>
        </footer>        
    </div>
</template>

<script>
import store from '../store.js'

export default {
	name: 'task-card',
	data: function(){return{
		tab: 'times',
		showDelete: false,
	}},
	store,
	props: {
		task: Object,
	},
	methods: {
		setTab: function(tab) {
			this.tab = tab;
		},
        clearTaskFromStack: function() {
            store.commit("REMOVEFROMSTACK", this.task.id);
        },
        completeTask: function() {
            store.commit("COMPLETETASK", this.task.id);
        },
        unCompleteTask: function() {
            store.commit("UNCOMPLETETASK", this.task.id);
        },
        deleteTask: function() {
            this.showDelete = true;
        },
        deleteTaskCancel: function() {
            this.showDelete = false;
        },
        deleteTaskConfirm: function() {
            store.dispatch("DELETETASK", this.task.id);
            this.showDelete = false;
        }
	},
	computed: {
		breadCrumbs: function() {
			let crumbs = store.getters.getBreadCrumbs(this.task.id);

            if(crumbs.length > 1)
                return crumbs.map(task => task.title).join("->");
            
            return "";

		},
        subTasks: function() {
            return store.getters.getSubTasks(this.task.id);
        }
	}
}
</script>