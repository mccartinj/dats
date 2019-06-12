

const puppeteer = require('puppeteer');
const landing_url = 'https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx';



(async () => {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(landing_url);

	await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlCounty','03');
	await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlSearchType','01');
	await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StartNavigationTemplateContainerID_btnContinue');


	await page.screenshot({path: 'example.png'});

  	await browser.close();


})();




