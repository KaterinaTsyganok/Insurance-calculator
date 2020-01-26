const express = require('express'),
    router = express.Router(),
    config = require('config'),
	fs = require('file-system'),
	nodemailer = require('nodemailer');

router.post('/api/calculator', (req, res) => {
	const carInfo = req.body;

	let insurancePremium = calculateInsurancePremium(carInfo);
	
	res.send(String(insurancePremium));
});

router.post('/api/calculator/send', (req, res) => {
	const emailInfo = req.body.emailInfo;

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'sendemail.test.node@gmail.com',
			pass: 'sendemail1!'
		}
	});

	transporter.sendMail({
		from: '"Калькулятор страхования" <sendemail.test.node@gmail.com>',
		to: `${emailInfo.email}`,
		subject: "Информация об оплате страхового взноса",
		text: "Информация об оплате страхового взноса",
		html: `Страховой взнос составит ${emailInfo.premium} EUR (${emailInfo.premiumInBYN} BYN на ${emailInfo.term})
		Порядок уплаты страхового взноса: ${(emailInfo.payment === 'one-time') ? 'единовременно' : `в два этапа. 
		Первая часть взноса: ${Math.ceil((emailInfo.premium/2)*100)/100} EUR`}`
	});
	
	res.sendStatus(204);
});

function calculateInsurancePremium(carInfo) {
	const carForTarif = transformCarForTarif(carInfo);

	let tarif = getTarif(carForTarif) * isTaxi(carInfo),
		multiplierCity = getMultiplierCity(carInfo),
		multiplierAgeExp = getMultiplierAgeExp(carInfo),
		multiplierPrivileges = (carInfo.privileges === 'yes') ? 0.5 : 1;
	
	let insurancePremiumProject = (tarif * ((multiplierCity - 1) + (multiplierAgeExp - 1) + (multiplierPrivileges - 1) + 1));

	return Math.floor(insurancePremiumProject*100)/100;
}

function getMultiplierAgeExp(carInfo) {
	const data = getMultipliersAgeExpFromDB()[0];
	return data[carInfo.age][carInfo.experience];
}

function getMultiplierCity(carInfo) {
	const data = getMultipliersCityFromDB()[0];
	return data[carInfo.cities];
}

function getMultipliersCityFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.multipliersCity'), 'utf8'));
}

function getMultipliersAgeExpFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.multipliersAgeExp'), 'utf8'));
}

function transformCarForTarif(carInfo) {
	const carForTarif = {
		'country': carInfo.country,
		'engine': +carInfo.engine,
		'period': carInfo.period
	};

	carForTarif.engine = (carForTarif.engine <= 1200) ? '<1200' : 
	( (1200 < carForTarif.engine) && (carForTarif.engine <= 1800) ) ? '1200-1800' :
	( (1800 < carForTarif.engine) && (carForTarif.engine <= 2500) ) ? '1800-2500' :
	( (2500 < carForTarif.engine) && (carForTarif.engine <= 3500) ) ? '2500-3500' :
	(3500 < carForTarif.engine) ? '>3500' : '';

	return carForTarif;
}

function getTarif(car) {
	const data = getTarifsFromDB();

	const resultObject = data.find(object => {
		const termObject = JSON.parse(JSON.stringify(object));
		delete termObject.value;

		return (JSON.stringify(car) === JSON.stringify(termObject));
	});
	return resultObject.value;
}

function getTarifsFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.tarifs'), 'utf8'));
}

function isTaxi(carInfo) {
	return (carInfo.taxi === 'yes') ? 1.4 : 1;
}

module.exports = router;