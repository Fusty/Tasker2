<template>
	<ul class="task-list" :class="{'is-list-root': isListRoot }">
    <transition-group :name="isListRoot ? 'fade-slide-up' : 'fade-slide-left'">
      <task-list-item v-for="(task, index) in tasks" :key="'task-list-item-'+task.id" class="task-list-item" :task="task"></task-list-item>
    </transition-group>
	</ul>
</template>

<script>
export default {
  name: 'task-list',
  props: {
    tasks: Array,
    isListRoot: Boolean,
  }
}
</script>