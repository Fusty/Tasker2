<template>
	<div class="empty-drag-area">
		<input type="text" class="light1 no-border" v-model="taskTitle" placeholder="New Sub-Task Title" @keydown.enter="newTask"/>
    </div>
</template>

<script>
import store from '../store.js'

export default {
	name: 'sub-task-entry',
	data: function(){return{
		taskTitle: '',
	}},
	store,
	props: {
		parentTask: Object,
	},
	methods: {
		newTask: function() {
			if(this.taskTitle != "")
				store.commit("NEWTASK", {parent: (this.parentTask && this.parentTask.id ? this.parentTask.id : undefined), title: this.taskTitle} );

			this.taskTitle = "";
		}
	}
}
</script>