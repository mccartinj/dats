

const puppeteer = require('puppeteer');
const $ = require('cheerio');

const landing_url = 'https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx';




(async () => {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const street_name = 'Heath';
	console.log(street_name);
	
	await page.goto(landing_url);
	await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlCounty','03');
	await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlSearchType','01');
	await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StartNavigationTemplateContainerID_btnContinue');
	await page.waitFor('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName');
	await page.$eval('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName', (el, value) => el.value = value, street_name);
	await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StepNavigationTemplateContainerID_btnStepNextButton');

	await page.waitFor('table#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult');

	var $links = $('.lnkdetails')




	await page.screenshot({path: 'example.png'});

  	await browser.close();


})();




