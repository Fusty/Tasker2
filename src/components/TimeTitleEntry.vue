<template>
    <div class="time-title-entry">
    </div>
</template>

<script>
import store from '../store.js'

export default {
	name: 'time-title-entry',
	data: function(){return{
	}},
	store,
	props: {
		times: Object,
	},
	methods: {
	},
	computed: {
        activeTime: function() {
            if(this.times[0].end)
                return null;
            return this.times[0];
        }
	}
}
</script>