class Reminders {
    getRemindersList() {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://localhost:3000/api/reminders', true);

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send();
		});
	}

	addReminder(newReminder) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:3000/api/calculator/add', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send(JSON.stringify(newReminder));
		});
	}

	removeReminder(id) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', `http://localhost:3000/api/reminders/${id}`, true);

            xhr.onload = () => resolve();

            xhr.send();
        });
	}

	clearRemindersList() {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', 'http://localhost:3000/api/reminders', true);

            xhr.onload = () => resolve();

            xhr.send();
        });
	}

	paySecondPart(id) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('PUT', `http://localhost:3000/api/reminders/${id}`, true);

            xhr.onload = () => resolve();

            xhr.send();
		});
	}
}

export default Reminders;