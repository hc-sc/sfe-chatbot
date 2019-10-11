var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
document.addEventListener("DOMContentLoaded", function(){
	function CreateSSMBanner(response, status, xhr){
		var strRawContents = response;
		strRawContents = strRawContents.replace(/\r/g, "");
		var arrLines = strRawContents.split("\n");
		var ListEvents = new Array();
		for (var i = 0; i < arrLines.length; i++) {ListEvents[i + 1]=new Array();ListEvents[i + 1]=arrLines[i].split('|');}
		//
		//[0] = Planned/Unplanned;[1] = Red banner Yes No;
		//[2] = Start;[3]  = End;
		//[4] = Type Eng;[5] = S&A Affected Eng;[6] = Impact Eng;
		//[7] = Type Fr;[8] = S&A Affected Fr;[9] = Impact Fr;
		//[10] =Link
		var
			BannerText="",
			BannerT = "",
			BannerStartDate = "",
			BannerEndDate = "",
			BannerOutage = "",
			BannerDetails = "",
			BannerContent = "",
			SaveBannerOutage = "",
			SaveBannerStartDate = "",
			//OuttageNumberWords = [], 
			OuttageEventsCount = 0;
		for (var line = 1;line<ListEvents.length; line ++) {
			if (ListEvents[line][1]==="Yes") {
				try {
					OuttageEventsCount++;
					if(lang==="en"){
						//Service Affected (English)
						BannerOutage=ListEvents[line][5]; 
						//Outtage Details (English)
						if(ListEvents[line][6]!==""){
							BannerDetails=ListEvents[line][6];
							BannerDetails = BannerDetails.replace(/%+/ig, "\n");
						}
					}else{
						//Service Affected (French)
						BannerOutage=ListEvents[line][8]; 
						//Outtage Details (French)
						if(ListEvents[line][9]!==""){
							BannerDetails=ListEvents[line][9];
							BannerDetails = BannerDetails.replace(/%+/ig, "\n");
						}
					}
					//Dates are in YYYY-MM-DD format (bilingual)
					BannerStartDate=ListEvents[line][2];
					BannerEndDate=ListEvents[line][3];
				}
				catch(err) {
					console.log(err);
					console.log("Erroneous line:\n");
					for (var i = 0; i < ListEvents[line].length; i++) {
						console.log(ListEvents[line][i]);
					}
				}	
				//English
				if(lang==="en"){
					//if there is only one outtage 
					if (OuttageEventsCount === 1){
						//change service interruptions alert type to warning
						document.getElementById("service-interruption-title").textContent="Service interruption";
						document.getElementById("interruptions").className="alert alert-warning";
						//change the title to Unplanned interruption singlular
						BannerT="<h3 class='h4 mrgn-tp-0 mrgn-bttm-md'>Unplanned interruption: "+BannerOutage+"</h3>";
						//if there is NO end date to the outtage
						if (BannerEndDate === ""){
							//Show the outtage information WITHOUT end date
							BannerText=BannerT+"<ul class='list-unstyled'><li><p>"+BannerDetails+"</p><p><strong>Start date: </strong>"+BannerStartDate+"</p></li></ul>";
						//if there IS an end date to the outtage
						}else{
							//Show the outtage information WITH end date
							BannerText+=BannerT+"<ul class='list-unstyled'><li><p>"+BannerDetails+"</p><p><strong>Start date: </strong>"+BannerStartDate+"</p><p><strong>End date: </strong>"+BannerEndDate+"</p></li></ul>";
						}
						//Save the service affected name and start date incase there is more then one outtage at a time.
						SaveBannerOutage = BannerOutage;
						SaveBannerStartDate = BannerStartDate;
					//if there is more then 1 outtage
					}else{
						//if there is exactly 2 outtages at one time
						if (OuttageEventsCount === 2){
							var OuttageNumberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
							document.getElementById("service-interruption-title").textContent="Service interruptions";
							BannerContent = "<ul class='list-unstyled'><li><p><strong>Service: </strong>"+SaveBannerOutage+"</p><p><strong>Start date: </strong>"+SaveBannerStartDate+"</p></li>";
						}
						BannerT="<h3 class='h4 mrgn-tp-0 mrgn-bttm-md'>"+OuttageNumberWords[OuttageEventsCount]+" unplanned interruptions: </h3>";
						BannerContent += "<li><p><strong>Service: </strong>"+BannerOutage+"</p><p><strong>Start date: </strong>"+BannerStartDate+"</p></li>";
						BannerText = BannerT+BannerContent;
					}
				//French
				}else{
					//if there is only one outtage 
					if (OuttageEventsCount === 1){
						//change service interruptions alert type to warning
						document.getElementById("service-interruption-title").textContent="Interruption de service";
						document.getElementById("interruptions").className="alert alert-warning";
						//change the title to Unplanned interruption singlular
						BannerT="<h3 class='h4 mrgn-tp-0 mrgn-bttm-md'>Interruption imprevue des services de TI&nbsp;: "+BannerOutage+"</h3>";
						//if there is NO end date to the outtage
						if (BannerEndDate === ""){
							//Show the outtage information WITHOUT end date
							BannerText=BannerT+"<ul class='list-unstyled'><li><p>"+BannerDetails+"</p><p><strong>Date de début&nbsp;: </strong>"+BannerStartDate+"</p></li></ul>";
						//if there IS an end date to the outtage
						}else{
							//Show the outtage information WITH end date
							BannerText+=BannerT+"<ul class='list-unstyled'><li><p>"+BannerDetails+"</p><p><strong>Date de début&nbsp;: </strong>"+BannerStartDate+"</p><p><strong>Date de fin&nbsp;: </strong>"+BannerEndDate+"</p></li></ul>";
						}
						//Save the service affected name and start date incase there is more then one outtage at a time.
						SaveBannerOutage = BannerOutage;
						SaveBannerStartDate = BannerStartDate;
					//if there is more then 1 outtage
					}else{
						//if there is exactly 2 outtages at one time
						if (OuttageEventsCount === 2){
							BannerT="<h3 class='h4 mrgn-tp-0 mrgn-bttm-md'>Deux interruptions imprévues des services de TI&nbsp;: </h3>";
							document.getElementById("service-interruption-title").textContent="Interruptions de service";
							BannerContent = "<ul class='list-unstyled'><li><p><strong>Service&nbsp;: </strong>"+SaveBannerOutage+"</p><p><strong>Date de début&nbsp;: </strong>"+SaveBannerStartDate+"</p></li>";
						//if there is 3 or more outtages at the same time
						}else{
							var OuttageNumberWords = ["Zéro", "Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf", "Dix"];
							BannerT="<h3 class='h4 mrgn-tp-0 mrgn-bttm-md'>"+OuttageNumberWords[OuttageEventsCount]+" interruptions imprévues des services de TI&nbsp;: </h3>";
						}
						BannerContent+="<li><p><strong>Service: </strong>"+BannerOutage+"</p><p><strong>Date de début&nbsp;: </strong>"+BannerStartDate+"</p></li>";
						BannerText = BannerT+BannerContent;
					}
				}
			}
		}
		//if there was an outtage
		if (OuttageEventsCount!==0) {
			//if there two or more outtages 
			if (OuttageEventsCount >= 2){ 
				//close the list
				BannerText+="</ul>";
			}
			//update the webpage to include the outtages
			document.getElementById("MySSMBanner").innerHTML=BannerText;
		}
}
function loadTxt(url, callback) {
	var req = new XMLHttpRequest();

	req.open("GET", url, true);
	req.onreadystatechange = function() {
		// FIXME: GCPEDIA has trouble prasing '&&' syntax in if statement
		if (req.readyState === 4) if (req.status >= 200) if (req.status < 400) {
			callback(req.responseText, req.status, req);
		}
	};
	req.send();
}
loadTxt("../gw-custom/get-outages.php", CreateSSMBanner);
});