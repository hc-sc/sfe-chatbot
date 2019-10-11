// JavaScript Document
var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
document.addEventListener("DOMContentLoaded", function(){
	function CreateSSMEventsTable(response, status, xhr) {
		var strRawContents = response;
		strRawContents = strRawContents.replace(/\r/g, "");
		var arrLines = strRawContents.split("\n");
		var ListEvents = new Array();
		for (var i = 0; i < arrLines.length; i++) {ListEvents[i + 1]=new Array();ListEvents[i + 1]=arrLines[i].split('|');}
		//
		//[0] = Planned/Unplanned;[1] = Red Outage Yes No;
		//[2] = Start;[3]  = End;
		//[4] = Type Eng;[5] = S&A Affected Eng;[6] = Impact Eng;
		//[7] = Type Fr;[8] = S&A Affected Fr;[9] = Impact Fr;
		//[10] =Link
		var
			TableText="<table class='table table-bordered wb-tables'>",
			OutageTableText="<table class='table table-bordered wb-tables'>",
			DDateSSM="",
			DHourSSM="",
			FDateSSM="",
			FHourSSM="",
			RFC="",
			TypeSSM="",
			SASSM="",
			ImpactSSM="",
			MoreDetails="",
			LinkEvents="",
			today = new Date(),
			someday = new Date(),
			OutageStartDate = "",
			OutageEndDate = "",
			//OutageType = "",
			OutageDetails = "",
			OutageName = "",
			OutageEventsCount = 0,
			PlannedOutageEventsCount = 0;
		
		if(lang==="en"){
			TableText+="<thead><tr class='bg-info'><th class='headerSSM'>RFC #</th><th class='headerSSM'>Affected services & applications</th><th class='headerSSM'>Impact</th><th class='headerSSM'>Start</th><th class='headerSSM'>End</th><th class='headerSSM'>Type</th></tr></thead>";
			OutageTableText+="<thead><tr class='bg-info'><th class='headerSSM'>Name</th><th class='headerSSM'>Details</th><th class='headerSSM'>Start</th><th class='headerSSM'>End</th></tr></thead>";
		}else{
			TableText+="<thead><tr class='bg-info'><th class='headerSSM'>DDC #</th><th class='headerSSM'>services et applications concernés</th><th class='headerSSM'>impact</th><th class='headerSSM'>début</th><th class='headerSSM'>fin</th><th class='headerSSM'>type</th></tr></thead>";
			OutageTableText+="<thead><tr class='bg-info'><th class='headerSSM'>Nom</th><th class='headerSSM'>détails</th><th class='headerSSM'>début</th><th class='headerSSM'>fin</th></tr></thead>";

		}
		
		for (var line = 1;line<ListEvents.length; line ++){
			
			if (ListEvents[line][0]==="Planned") {
				
				someday.setFullYear(parseInt(ListEvents[line][3].substring(0,4)),parseInt(ListEvents[line][3].substring(5,7))-1,parseInt(ListEvents[line][3].substring(8,10)));	

			
				if (someday >= today) {
					PlannedOutageEventsCount++;
					DDateSSM=ListEvents[line][2].substring(0,10);
					DHourSSM=ListEvents[line][2].substring(11);
					FDateSSM=ListEvents[line][3].substring(0,10);
					FHourSSM=ListEvents[line][3].substring(11);
					RFC=ListEvents[line][11];

					if(lang==="en"){
						TypeSSM=ListEvents[line][4];
						SASSM=ListEvents[line][5];
						ImpactSSM=ListEvents[line][6].replace(/%%%%/g, "<br>");
						MoreDetails="More details";
					}else{
						TypeSSM=ListEvents[line][7];
						SASSM=ListEvents[line][8];
						ImpactSSM=ListEvents[line][9].replace(/%%%%/g, "<br>");
						MoreDetails="Plus de détails";
					}

					if(ListEvents[line][10]!=="No"){
						LinkEvents="<div><a href='"+ListEvents[line][10]+"' target='_blank'>"+MoreDetails+"</a></div></td>";
					}else{
						LinkEvents="";
					}

					TableText+="<tr>";
					TableText+="<td class='col3SSM'>"+RFC+"</td>";
					TableText+="<td class='col2SSM'>"+SASSM+"</td>";
					TableText+="<td class='col3SSM'>"+ImpactSSM+LinkEvents+"</td>";
					TableText+="<td class='col1SSM'>"+DDateSSM+"<br>"+DHourSSM+"</td>";
					TableText+="<td class='col1SSM'>"+FDateSSM+"<br>"+FHourSSM+"</td>";
					TableText+="<td class='col1SSM'>"+TypeSSM+"</td>";
					TableText+="</tr>";
				}
			}
			if (ListEvents[line][1]==="Yes") {
				OutageEventsCount++;
				if(lang==="en"){
					//Service Affected (English)
					OutageName=ListEvents[line][5]; 
					//Outtage Details (English)
					if(ListEvents[line][6]!==""){
						OutageDetails=ListEvents[line][6];
						OutageDetails = OutageDetails.replace(/%+/ig, "\n");
					}
				}else{
					//Service Affected (French)
					OutageName=ListEvents[line][8]; 
					//Outtage Details (French)
					if(ListEvents[line][9]!==""){
						OutageDetails=ListEvents[line][9];
						OutageDetails = OutageDetails.replace(/%+/ig, "\n");
					}
				}
				
				//Dates are in YYYY-MM-DD format (bilingual)
				OutageStartDate=ListEvents[line][2];
				OutageEndDate=ListEvents[line][3];
				
				OutageTableText+="<tr>";
				OutageTableText+="<td class='col3SSM'>"+OutageName+"</td>";
				OutageTableText+="<td class='col2SSM'>"+OutageDetails+"</td>";
				OutageTableText+="<td class='col3SSM'>"+OutageStartDate+"</td>";
				OutageTableText+="<td class='col1SSM'>"+OutageEndDate+"</td>";
				OutageTableText+="</tr>";
				
				if(lang==="en"){
					if (OutageEventsCount ===1){
						document.getElementById("service-interruption-title").textContent="Unplanned IT service interruption";
					}else{
						document.getElementById("service-interruption-title").textContent="Unplanned IT service interruptions";
					}
				}else{
					if (OutageEventsCount ===1){
						document.getElementById("service-interruption-title").textContent="Interruption de service imprévue";
					}else{
						document.getElementById("service-interruption-title").textContent="Interruptions de service imprévues";
					}
				}
			}
		}
		//if there was an outtage
		if (OutageEventsCount!==0) {
			OutageTableText+="</table>";
			document.getElementById("unplanned-service-interruption-alert").className="alert alert-warning";
			document.getElementById("service-interruption-info").innerHTML=OutageTableText;
		}else{
			if(lang==="en"){
				document.getElementById("service-interruption-info").innerHTML="<p>No unplanned IT service interruptions at this time.</p>";
			}else{
				document.getElementById("service-interruption-info").innerHTML="<p>Aucune interruption de service informatique non planifiée pour le moment.</p>";
			}
		}
		if (PlannedOutageEventsCount!==0){
			if(lang==="en"){
				TableText+="</table><p>The schedule and information posted is provided by SSC and is as up-to-date and as complete as is possible. All times listed are Eastern Time.</p>";
			}else{
				TableText+="</table><p>Le programme et les renseignements publiés sont fournis par SPC et sont aussi à jour et complets que possible. Les heures sont exprimées en heure de l'Est</p>";
			}
			document.getElementById("planned-service-interruption-alert").className="alert alert-warning";
			document.getElementById("PlannedITServiceInterruptionsSchedule").innerHTML=TableText;
		}else{
			if(lang==="en"){
				document.getElementById("PlannedITServiceInterruptionsSchedule").innerHTML="<p>No planned IT service interruptions scheduled.</p>";
			}else{
				document.getElementById("PlannedITServiceInterruptionsSchedule").innerHTML="<p>Aucune interruption de service informatique planifiée prévue.</p>";
			}
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

	loadTxt("../gw-custom/get-outages.php", CreateSSMEventsTable);
});