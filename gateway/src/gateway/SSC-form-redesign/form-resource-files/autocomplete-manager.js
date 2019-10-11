
$(document).ready(function () {
    $('#manager_search').autocomplete({
        serviceUrl: '/ajax/employees',
        transformResult: function (response) {
            return {
                suggestions: $.map($.parseJSON(response), function (dataItem) {
                    return {
                        value: dataItem.full_name + ' ' + dataItem.email,
                        data: dataItem
                    };
                })
            };
        },
        minChars: 3,
        width: 400,
        onSelect: function (suggestion) {
            fillManager(suggestion.data);
        }
    });
	
	    $('#alternate_search').autocomplete({
        serviceUrl: '/ajax/employees',
        transformResult: function (response) {
            return {
                suggestions: $.map($.parseJSON(response), function (dataItem) {
                    return {
                        value: dataItem.full_name + ' ' + dataItem.email,
                        data: dataItem
                    };
                })
            };
        },
        minChars: 3,
        width: 400,
        onSelect: function (suggestion) {
            fillAlternate(suggestion.data);
        }
    });
});

function fillManager(data) {
    $("#manager_search").val("");
    $("#manager_email_address").val(data.email);
	 $("#network_access").val(data.email);
   $("#manager_first_name").val(data.first_name);
    $("#manager_last_name").val(data.last_name);
    $("#manager_phone_number").val(data.phone);
	 $("#approval_name").val(data.full_name);
	 

	  $("#approval_email").val(data.email);
}
function fillAlternate(data) {
	 $("#alternate_search").val("");
	 $("#alternate_name").val(data.full_name);
	 

	 
}