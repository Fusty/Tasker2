let Driver = function(save, load, init) {
	this.save = save;
	this.load = load;

	// Let the driver initialize itself
	if(init)
		this.init();
}

export default {
	localStorage: new Driver(
		async saveData => {
			localStorage.setItem('tasker2', JSON.stringify(saveData));
		},
		async () => {
			try {
				let loadData = JSON.parse(localStorage.getItem('tasker2'));
				if(loadData)
					return loadData;
				else
					return {};
			} catch(err) {
				return {};
			}
		}
	),
	// TODO: Add more persistence options
}