import Component from '../../views/component';

import HeaderTemplate from '../../../templates/partials/header';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => resolve(HeaderTemplate({
            isAboutPage: !resource,
            isCalculatorPage: (resource === 'calculator'),
            isRemindersPage: (resource === 'reminders')
        })));
                /*
                <div class="header__title">
                    <h1>калькулятор</h1>
                    <p>обязательного страхования в республике беларусь</p>
                </div>
                <div class="header__links">
                    <a class="header__links-item ${!resource ? 'active' : ''}" href="/#/">
                        О приложении
                    </a>
                    <a class="header__links-item ${resource === 'calculator' ? 'active' : ''}" href="/#/calculator">
                        Расчет тарифа
                    </a>
                    <a class="header__links-item ${resource === 'reminders' ? 'active' : ''}" href="/#/reminders">
                        Напоминания
                    </a>
                </div>
                */
    }
}

export default Header;