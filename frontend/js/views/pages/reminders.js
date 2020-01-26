import Component from '../../views/component';

import Reminders from '../../models/reminders';

import RemindersTemplate from '../../../templates/pages/reminders/reminders';

class InteractReminders extends Component {
    constructor() {
		super();

		this.modelReminders = new Reminders();
    }

    getData() {
		return new Promise(resolve => this.modelReminders.getRemindersList().then(reminders => resolve(reminders)));
	}

    render(reminders) {
        return new Promise(resolve => {
            resolve(RemindersTemplate({reminders}));
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const remindersWrapper = document.getElementsByClassName('reminders-wrapper')[0],
            clearRemindersListButton = document.getElementsByClassName('remove-all')[0];

        remindersWrapper.addEventListener('click', event => {
            const target = event.target;

            target.classList.contains('remove') ? this.removeReminder(clearRemindersListButton, target.parentNode, target.parentNode.parentNode) : '';
            target.classList.contains('remove-all') ? this.clearRemindersList(target, target.nextElementSibling) : '';
            target.classList.contains('pay') ? this.paySecondPart(target,target.parentNode, target.previousElementSibling) : '';
        });
    }

    paySecondPart(target, reminder, description) {
        this.modelReminders.paySecondPart(reminder.dataset.id).then(() => {
            target.remove();
            description.innerHTML = 'Страховой взнос оплачен полностью';
        });
    }

    removeReminder(clearRemindersListButton, reminder, remindersList) {
        if (confirm('Вы уверены?')) {
            this.modelReminders.removeReminder(reminder.dataset.id).then(() => {
                reminder.remove();
                !remindersList.children.length && (clearRemindersListButton.disabled = true);
            });
        }
    }

    clearRemindersList(button, remindersList) {
        if (confirm('Вы уверены?')) {
            this.modelReminders.clearRemindersList().then(() => {
                button.disabled = true;
                remindersList.innerHTML = '';
            });
        }
    }
}

export default InteractReminders;