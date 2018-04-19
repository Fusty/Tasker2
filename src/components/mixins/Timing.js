import store from '../../store.js'

/////////////////////////////////////////////////////////
//
//		This mixin supports stopwatch output and 
//		a general awareness of a tasks current timer
//
/////////////////////////////////////////////////////////

export default {
	data: function(){return {
		stopwatch: "00:00:00"
	}},
	props: {
		task: Object,
	},
	store,
	mounted: function() {
		setInterval(() => this.updateTime(), 1000);
	},
	methods: {
		updateTime() {
			if(this.activeTime) {
				var elapsed = store.getters.getElapsedTime(this.activeTime.id);
				this.stopwatch = elapsed.join(":");
			}else
				this.stopwatch = "00:00:00";
		}
	},
	computed: {
		times: function() {
			return store.getters.getTimingForTask(this.task.id);
		},
		activeTime: function() {
			if(this.times[0] && this.times[0].end)
				return null;
			return this.times[0];
		},
		hasActiveTimer: function() {
			return store.getters.hasActiveTimer(this.task.id);
		},
		hasActiveTimerChildren: function() {
			return store.getters.hasAcitveTimerChildren(this.task.id);
		}	
	}
}