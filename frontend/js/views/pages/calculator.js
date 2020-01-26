import Component from '../../views/component';

import Values from '../../models/values';

import Reminders from '../../models/reminders';

import CarInfoTemplate from '../../../templates/pages/calculator/carInfo';
import InsurerInfoTemplate from '../../../templates/pages/calculator/insurerInfo';
import ResultBlockTemplate from '../../../templates/pages/calculator/resultBlock';

class Calculator extends Component {
    constructor() {
		super();

        this.modelValues = new Values();
        this.modelReminders = new Reminders();
	}

    render() {
        return new Promise(resolve => {
            resolve(CarInfoTemplate());
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const insuranceForm = document.getElementsByClassName('insurance-calculator')[0],
            noPassportSelect = document.getElementById('no-passport'),
            calcAmountButton = insuranceForm.getElementsByClassName('calculate-amount')[0],
            engineInput = document.getElementById('engine');

        noPassportSelect.addEventListener('change', () => {
           (noPassportSelect.value === 'no') ? this.addInsuranceBlock(insuranceForm) : this.removeInsuranceBlock(insuranceForm);
        });

        calcAmountButton.addEventListener('click', () => {
            event.preventDefault();
            this.validateEngineInput(engineInput, calcAmountButton) && this.calculateInsurancePremium(insuranceForm);
        });

        engineInput.addEventListener('keyup', () => {
            calcAmountButton.disabled = !engineInput.value.trim();
            engineInput.classList.remove('error-input');
            engineInput.nextElementSibling.innerHTML = '';
        });
    }

    validateEngineInput(input, calcAmountButton) {
        if (Number.isInteger(+input.value) && +input.value >=500 && +input.value <= 20000) {
            input.classList.remove('error-input');
            input.nextElementSibling.innerHTML = '';
            return true;
        } else {
            calcAmountButton.disabled = true;
            return this.showErrorMessage(input);
        }
    }

    showErrorMessage(input) {
        input.value = '';
        input.classList.add('error-input');
        input.nextElementSibling.innerHTML = (input.classList.contains('email')) ? 'Введите корректное значение email' :
        'Значение не корректно. Введите целое число от 500 до 7000';
    }

    addInsuranceBlock(insuranceForm) {
        insuranceForm.children[insuranceForm.children.length-1].insertAdjacentHTML('beforebegin', InsurerInfoTemplate());
    }

    removeInsuranceBlock(insuranceForm) {
        insuranceForm.children[insuranceForm.children.length-2].remove();
    }

    calculateInsurancePremium(insuranceForm) {
        const carInfo = {
            'country': document.getElementById('country').value,
            'engine': document.getElementById('engine').value,
            'period': document.getElementById('period').value,
            'taxi': document.getElementById('taxi').value,
            'cities' : document.getElementById('cities').value,
            'age' : document.getElementById('age') ? document.getElementById('age').value : 'less25',
            'experience' : document.getElementById('experience') ? document.getElementById('experience').value : 'less2',
            'no-passport': document.getElementById('no-passport').value,
            'privileges' : document.getElementById('privileges') ? document.getElementById('privileges').value : 'no'
        };

        this.modelValues.calculateAmount(carInfo).then(premium => this.showInsurancePremium(insuranceForm, premium));
    }

    showInsurancePremium(insuranceForm, premium) {
        this.modelValues.getRate().then(rate => {
            const resultBlockWrapper = insuranceForm.nextElementSibling,
                paymentSelect = document.getElementById('payment');

            resultBlockWrapper.innerHTML = this.createInsurancePremiumBlock(paymentSelect, premium, rate);
            this.setSaveAction(paymentSelect, premium, rate);
        });
    }

    setSaveAction(paymentSelect, premium, rate) {
        const saveButton = document.getElementsByClassName('save')[0],
            sendButton = document.getElementsByClassName('send')[0],
            emailInput = document.getElementsByClassName('email')[0];

        saveButton.addEventListener('click', () => {
            event.preventDefault();
            this.addReminder(paymentSelect, premium);
        });

        emailInput.addEventListener('keyup', () => {
            sendButton.disabled = !emailInput.value.trim();
            emailInput.classList.remove('error-input');
            emailInput.nextElementSibling.innerHTML = '';
        });

        sendButton.addEventListener('click', () => {
            event.preventDefault();

            const emailInfo = {
                premium,
                'premiumInBYN': Math.round(premium * rate.Cur_OfficialRate*100)/100,
                'email': emailInput.value,
                'term': this.getDate(),
                'payment': paymentSelect.value
            };

            this.validateSendEmailInput(emailInfo, emailInput, sendButton) && this.modelValues.sendEmail({emailInfo}).then(() => alert('Email отправлен'));
        });
    }

    validateSendEmailInput(emailInfo, emailInput, sendButton) {
        return (/^([\w\-.])+@([\w\-.])+\.([A-Za-z]{2,4})$/i.test(emailInfo.email)) ? true : ((sendButton.disabled = true) && this.showErrorMessage(emailInput));
    }

    addReminder(paymentSelect, premium) {
        const newReminder = {
            model: prompt('Введите марку автомобиля').trim() || '.',
            premium,
            premiumForSecondPart: Math.floor((premium/2)*100)/100,
            term: this.getDate(12),
            payment: (paymentSelect.value === 'one-time') ? paymentSelect.value : this.getDate(6)
        };

        this.modelReminders.addReminder(newReminder).then(() => {
			alert('Напоминание сохранено');
		});
    }

    createInsurancePremiumBlock(paymentSelect, premium, rate) {
        let payment = paymentSelect.value;

        const paymentInfo = (payment === 'one-time') ? {
            premium,
            premiumInBYN: Math.round(premium * rate.Cur_OfficialRate*100)/100,
            date: this.getDate(),
            premiumForSecondPart: ''
        } : {
            premium: Math.ceil((premium/2)*100)/100,
            premiumInBYN: Math.round(premium/2 * rate.Cur_OfficialRate*100)/100,
            date: this.getDate(),
            premiumForSecondPart: Math.floor((premium/2)*100)/100,
            termForSecondPart: this.getDate(6)
        };

        return ResultBlockTemplate({paymentInfo});
    }

    getDate(month = 0) {
        let date = new Date();
        date.setMonth(date.getMonth() + month);
        return date.toLocaleDateString();
    }
}

export default Calculator;