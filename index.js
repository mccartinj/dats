

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const objectsToCsv = require('objects-to-csv');

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

		await page.waitFor('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_89');

		
		const links = await page.$$('a.lnkdetails');

		var all_data= [];

		for (let i = 0; i < links.length; i++) {
			
			let propdata = {};

			await page.waitFor(2000);
			await page.click('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_'+i);
			await page.waitFor(2000);

			let content = await page.content()
			var $ = cheerio.load(content);

			//let premises_addrress = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPremisesAddress_0').text();

			let $address_node = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPremisesAddress_0');
			$address_node.find('br').replaceWith(' ');
			let premises_addrress = $address_node.text();

			//premises_addrress = premises_addrress.splice(premises_addrress.indexOf('BALTIMORE'),0," ")


			propdata.premises_addrress = premises_addrress;
			propdata.owner_name = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0').text();


			let $owner_mail_node = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblMailingAddress_0');
			$owner_mail_node.find('br').replaceWith(' ');
			let owner_mail = $owner_mail_node.text();
			/*
			if( owner_mail.indexOf('BALTIMORE') > 0 ) {
				owner_mail = owner_mail.splice(owner_mail.indexOf('BALITMORE'),0," ");
			}
			*/
			propdata.owner_mail = owner_mail;

			propdata.prop_use = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblUse_0').text();
			propdata.principal_resi = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPrinResidence_0').text();
			propdata.block = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label11_0').text();
			propdata.lot = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label12_0').text();
			propdata.block_lot = propdata.block+'-'+propdata.lot;
			propdata.year_built = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label18_0').text();
			propdata.above_ground_gfa = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label19_0').text();
			propdata.basement_gfa = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label27_0').text();
			propdata.stories = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label22_0').text();
			propdata.type = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label24_0').text();
			propdata.baths = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label34_0').text();
			propdata.last_reno = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblRenovation_0').text();
			propdata.land_val = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblBaseLandNow_0').text();
			propdata.impr_val = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblBaseImproveNow_0').text();
			propdata.total_val = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblBaseTotalNow_0').text();
			propdata.last_sale_date = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label39_0').text();
			propdata.last_sale_price = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label40_0').text();
			propdata.last_seller = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label38_0').text();
			propdata.nextlast_sale_date = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label45_0').text();
			propdata.nextlast_sale_price = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label46_0').text();
			propdata.nextlast_seller = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_Label44_0').text();

			let addr_match_mail = 'true';
			if (propdata.premises_addrress == propdata.owner_mail) {
				addr_match_mail = 'true';
			} else {
				addr_match_mail = 'false';
			}

			propdata.addr_match_mail = addr_match_mail;


			console.log(premises_addrress);


			all_data.push(propdata);

			



			await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_btnPrevious_top2')
		}



		
		let csv = new objectsToCsv(all_data);
		await csv.toDisk('./test.csv',header=true)
	  	await browser.close();

  //log errors
  } catch(error) {
  		console.log(error);
  }

})();




String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};