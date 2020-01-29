$(document).ready(function()
{
    $.ajax("http://kunet.kingston.ac.uk/k1419859/mapData.php")
        .done(function(data) 
		{
        	data = JSON.parse(data);

        	var productGrid = $("#productGrid");
        	var row = productGrid;

		//for loop which allows users to select any food image on Food Product's page and displays it on the description, marker and image on map
        	for (var i = 0; i < data.length; i++) 
			{
        		var outerDiv = $("<div>").addClass("col-2");
        		var aTag = $("<a>").attr("href", "http://kunet.kingston.ac.uk/k1419859/UKMap.html?foodId=" + data[i]["ProductID"]);
        		var innerDiv = $("<div>").addClass("gallery");
        		var imgTag = $("<img>").attr("src", data[i]["Image"]).attr("style", "width:250px; height:150px");
        		var descriptionDiv = $("<div>").addClass("description").html(data[i]["ProductName"]);
        		innerDiv.append(imgTag).append(descriptionDiv);
        		aTag.append(innerDiv);
        		outerDiv.append(aTag);

        		row.append(outerDiv);
        		
        	}
        });
})
