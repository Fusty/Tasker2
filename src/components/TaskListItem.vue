<template>
		<li v-if="!taskCardHeading" :class="{'is-complete': isComplete, 'has-incomplete-children': hasIncompleteChildren}">
			<span class="sub-task-count" v-text="subTasks.length" @click="toggleChildren();"  @dblclick="focusTask()"></span>
			<span class="task-title" v-text="$options.filters.truncate(task.title, 40, ' . . .')" @click="toggleChildren()" @dblclick="focusTask()"></span>
			<svg height="30" width="40" class="task-title-tip" @click="toggleChildren()" >
				<polygon class="pencil-wood" points="0,0 16,7.5 16,22.5 0,30" />
				<polygon class="pencil-lead" :class="{'timer-active': hasActiveTimer, 'timer-active-children': hasActiveTimerChildren, 'show-children': showChildren}" points="20,9 20,21 31,15"/>
			</svg>
			<span v-if="hasActiveTimer" class="stopwatch"  @dblclick="focusTask()">{{ stopwatch }}&nbsp;&nbsp;{{ activeTime.title }}</span>
			<task-list v-show="showChildren" :tasks="subTasks" :parent-task="task" @specific-click-task="inTask => $emit('specific-click-task', inTask)" @click-task="inTask => $emit('click-task', inTask)"></task-list>            
			<transition name="fade-slide-left">
				<sub-task-entry v-if="showChildren && subTasks.length == 0" :parent-task="task"></sub-task-entry>
			</transition>
		</li>
		<li v-else class="task-list-item big">
			<span class="sub-task-count" v-text="subTasks.length" ></span>
			<input class="task-title" v-model="task.title" ></input>
			<svg height="30" width="40" class="task-title-tip" >
				<polygon class="pencil-wood" points="0,0 16,7.5 16,22.5 0,30" />
				<polygon class="pencil-lead" :class="{'timer-active': hasActiveTimer, 'timer-active-children': hasActiveTimerChildren, 'show-children': showChildren}" points="20,9 20,21 31,15"/>
			</svg>
		</li>
</template>

<script>
import store from '../store.js'
import Timing from './mixins/Timing.js'

export default {
  name: 'task-list-item',
	store,
	props: {
		task: Object,
		taskCardHeading: Boolean
	},
	mixins: [Timing],
	data: function() {return {
		showChildren: false,
	}},
	methods: {
		focusTask: function() {
			store.commit("FOCUSTASK", this.task.id);
		},
		toggleChildren: function() {
			this.showChildren = !this.showChildren;
		},
	},
	computed: {
		subTasks: function() {
			return store.getters.getSubTasks(this.task.id) 
		},
		hasIncompleteChildren: function() {
			// TODO: Implement me
			return false;
		},
		isComplete: function() {
			return this.task.completed != null;
		}
	}
}
</script>