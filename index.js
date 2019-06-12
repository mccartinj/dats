

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


		//navigate to page of links to properties' sdat cards
		await page.goto(landing_url);
		await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlCounty','03');
		await page.select('#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchType_ddlSearchType','01');
		await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StartNavigationTemplateContainerID_btnContinue');
		await page.waitFor('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName');
		await page.$eval('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucEnterData_txtStreetName', (el, value) => el.value = value, street_name);
		await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_StepNavigationTemplateContainerID_btnStepNextButton');
		await page.waitFor('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_0');

		//collect links and create an array to hold info from each card
		const links = await page.$$('a.lnkdetails');
		var all_data= [];

		//loop through each link
		for (let i = 0; i < links.length; i++) {
			
			let propdata = {};

			//wait for last loop to finish
			await page.waitFor(2000);

			//click next link in line and wait for card to load
			await page.click('a#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucSearchResult_gv_SearchResult_lnkDetails_'+i);
			await page.waitFor(2000);

			//throw sdat card into cheerio (node's version of jquery) for easy traversing
			let content = await page.content()
			var $ = cheerio.load(content);

			//all addresses include a <br> tag, so we can't just use .text() ... instead put it in a node and run find and replace, then text() it.
			let $address_node = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblPremisesAddress_0');
			$address_node.find('br').replaceWith(' ');
			let premises_addrress = $address_node.text();
			propdata.premises_addrress = premises_addrress;

			let $owner_mail_node = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblMailingAddress_0');
			$owner_mail_node.find('br').replaceWith(' ');
			let owner_mail = $owner_mail_node.text();
			propdata.owner_mail = owner_mail;

			//all the other fields we can just pull text() from for now. we may want to clean others (like gfa) later
			propdata.owner_name = $('span#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0').text();
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

			//this sort of verifies owner occupancy, but so far it's not working at all.
			/*
			let addr_match_mail = 'true';
			if (propdata.premises_addrress == propdata.owner_mail) {
				addr_match_mail = 'true';
			} else {
				addr_match_mail = 'false';
			}

			propdata.addr_match_mail = addr_match_mail;
			*/

			console.log(premises_addrress);
			all_data.push(propdata);

			


			//go back, but not with the browser's back button, since sdat isn't set up like that
			await page.click('input#MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_btnPrevious_top2')
		}



		//export to csv
		let csv = new objectsToCsv(all_data);
		await csv.toDisk('./test.csv',header=true)
	  	await browser.close();

  //log errors
  } catch(error) {
  		console.log(error);
  }

})();

