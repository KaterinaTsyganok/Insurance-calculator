class Values {
	calculateAmount(car) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:3000/api/calculator', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send(JSON.stringify(car));
		});
	}

	sendEmail(premium) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:3000/api/calculator/send', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send(JSON.stringify(premium));
		});
	}

	getRate() {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://www.nbrb.by/API/ExRates/Rates/292', true);

			xhr.onload = () => {
				try {
					resolve(JSON.parse(xhr.response));
				} catch (error) {
					reject();
				}
			};

			xhr.send();
		});
	}
}

export default Values;