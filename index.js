

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

//declare sdat info and street
const landing_url = 'https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx';
const street_name = 'Heath';

(async () => {
	//wrapped in a try to catch errors
	try {
		//load pupputeer
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(landing_url);
		await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlCounty','03');
		await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlSearchType','01');
		await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StartNavigationTemplateContainerID_btnContinue');
		await page.waitFor('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName');
		await page.$eval('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName', (el, value) => el.value = value, street_name);
		await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StepNavigationTemplateContainerID_btnStepNextButton');

		await page.waitFor('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_0');

		const property_table = await page.$$eval('table#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult', property_table => {
			return property_table;
		});

		const links = await page.$$eval('a.lnkdetails', links => links.map(link => link.href));
		console.log(links);

		

		/*
		await page.evaluate( () => {
			let links = document.getElementsByClassName('lnkdetails');
			console.log(links)
			for (let link of links) {
				link.click();
				let owner_name = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0');
				console.log(owner_name);
			}
		} )
		*/
			



		/*
		await page.click('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_0');
		await page.waitFor(3000)

		let content = await page.content()
		var $ = cheerio.load(content);

		let owner_mail = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblMailingAddress_0');
		let prop_use = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblUse_0');
		let principal_resi = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPrinResidence_0');
		let premises_addrress = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPremisesAddress_0')
		let block = 
		let lot = 
		let block_lot = block+'-'+lot;
		let year_built = 
		let above_ground_gfa =
		let basement_gfa = 
		let stories = 
		let type = 
		let baths = 
		let last_reno = 
		let land_val =
		let impr_val = 
		let total_val =
		let last_sale_date = 
		let last_sale_price = 
		let last_seller = 
		let nextlast_sale_date =
		let nextlast_sale_price = 
		let nextlast_seller = 


		*/







		

		await page.screenshot({path: 'example.png'});

	  	await browser.close();

  //log errors
  } catch(error) {
  		console.log(error);
  }

})();




