<template>
	<div class="width-7 border-group border-group--vertical">
		<transition name="fade-slide-right">
		<button v-show="taskStack.length != 0" @click="clearStack()" class="danger1 full-width">
			Clear Task Stack
		</button>
		</transition>
		<transition-group name="fade-slide-right">
		<task-card v-for="(task, index) in taskStack" :task="task" :key="'task-card-'+task.id"></task-card>
		</transition-group>
	</div>
</template>

<script>
import store from '../store.js'

export default {
	name: 'task-stack',
	store,
	methods: {
		clearStack() {
			store.commit('CLEARSTACK');
		}
	},
	computed: {
		taskStack: () => store.getters.getTaskStack,
	}
}
</script>