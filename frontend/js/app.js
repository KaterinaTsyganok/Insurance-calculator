import '../styles/app';

import Utils from './helpers/utils';

import Header from './views/partials/header';
import Footer from './views/partials/footer';

import About from './views/pages/about';
import Error404 from './views/pages/error404';
import CalculatePremium from './views/pages/calculator';
import InteractReminders from './views/pages/reminders';

const Routes = {
    '/': About,
    '/calculator': CalculatePremium,
    '/reminders': InteractReminders
};

function router() {
    const headerContainer = document.getElementsByClassName('header')[0],
          contentContainer = document.getElementsByClassName('main')[0],
          footerContainer = document.getElementsByClassName('footer')[0],
          header = new Header(),
          footer = new Footer();

    header.render().then(html => {
        headerContainer.innerHTML = html;
    });

    const request = Utils.parseRequestURL(),
        parsedURL = `/${request.resource || ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.getData().then(data => {
        page.render(data).then(html => {
            contentContainer.innerHTML = html;
            page.afterRender();
        });
    });

    footer.render().then(html => {
        footerContainer.innerHTML = html;
    });
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);