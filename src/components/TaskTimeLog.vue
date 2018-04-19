<template>
  <li>
    {{ time.title }}
  </li>
</template>

<script>
export default {
  name: 'task-time-log',
  props: {
    time: Object,
  },
}
</script>