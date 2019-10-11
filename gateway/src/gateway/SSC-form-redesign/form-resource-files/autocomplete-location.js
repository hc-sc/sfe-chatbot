
$(document).ready(function () {
    $('#location_search').autocomplete({
        serviceUrl: '/ajax/locations',
        transformResult: function (response) {
            return {
                suggestions: $.map($.parseJSON(response), function (dataItem) {
                    return {
                       value: dataItem.location + ' - ' + dataItem.address,
                        data: dataItem
                    };
                })
            };
        },
        minChars: 3,
        width: 600,
        onSelect: function (suggestion) {
            fillLocation(suggestion.data);
            
        }
    });
});

function fillLocation(data) {
	
	var pathArray = window.location.pathname;
	var pathArray2 = pathArray.split( '/' );
	var lang = pathArray2[1];
	//check to see if '>' exists in the string
	if (data.location.indexOf(">") > -1) {
	//exists
		//check if lang is english or french next
		if (lang == 'fr'){
			$("#location").val(data.location.split('>')[1]);
		}
		else{
			$("#location").val(data.location.split('>')[0]);
			
		}
	} else {
	//doesn't exist - take whatever is there 
		$("#location").val(data.location);
	}
	
	//check to see if '/' exists in the string
	if (data.address.indexOf("/") > -1) {
		if (lang == 'fr'){
			$("#street_address").val(data.address.split('/')[1]);
		}
		else{
			$("#street_address").val(data.address.split('/')[0]);
			
		}

		
	} else {
	//doesn't exist - take whatever is there 
		$("#street_address").val(data.address);
	}
	
    $("#location_search").val("");
    $("#region").val(data.region.toLowerCase());
	 $("#city").val(data.city.toLowerCase());
	  $("#postal").val(data.postal.toLowerCase());
  
}

