const express = require('express'),
    router = express.Router(),
    config = require('config'),
	fs = require('file-system'),
	shortId = require('shortid');

router.get('/api/reminders', (req, res) => {
	res.send(getRemindersFromDB());
});

router.post('/api/calculator/add', (req, res) => {
	const data = getRemindersFromDB(),
		reminder = req.body;

	reminder.id = shortId.generate();
	reminder.model = reminder.model || 'Модель не указана';

	data.push(reminder);
    setRemindersToDB(data);

	res.send(reminder);
});

router.delete('/api/reminders/:id', (req, res) => {
    const data = getRemindersFromDB(),
        updatedData = data.filter(reminder => reminder.id !== req.params.id);

	setRemindersToDB(updatedData);

    res.sendStatus(204);
});

router.delete('/api/reminders', (req, res) => {
    fs.writeFileSync(config.get('database.reminders'), JSON.stringify([]));

    res.sendStatus(204);
});

router.put('/api/reminders/:id', (req, res) => {
    const data = getRemindersFromDB();
    data.find(reminder => reminder.id === req.params.id).payment = 'one-time';

	setRemindersToDB(data);

    res.sendStatus(204);
});

function getRemindersFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.reminders'), 'utf8'));
}

function setRemindersToDB(data) {
    fs.writeFileSync(config.get('database.reminders'), JSON.stringify(data));
}

module.exports = router;