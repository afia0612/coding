$(document).ready(function()
{
	//ajax function used to create search bar where user is able to search for a town on the homepage 
	$.ajax("http://kunet.kingston.ac.uk/k1419859/mapData.php")
        .done(function(data) 
		{
			//used to convert a JSON text into a JavaScript object and display the data onto the web page
        	data = JSON.parse(data);
			
			//function which allows user to input a character / letter on the search bar to display the town names which include that letter in them  
	        new autoComplete(
	    	{
	    		selector: $("#pac-input").get(0),
	    		minChars: 1,
	    		source: function(term, suggest)
				{
			        var options = 
					{
		              shouldSort: true,
		              threshold: 0.6,
		              location: 0,
		              distance: 100,
		              maxPatternLength: 32,
		              minMatchCharLength: 1,
		              keys: ["PlaceOfOrigin"]
		            };
					//Fuse - searches for towns by getting the data from the towns table and displaying it on the search bar
		            var fuse = new Fuse(data, options);
		            var results = fuse.search(term);
		            var matches = [];

		            for (var i = 0; i < results.length; i++) 
					{
		            	var duplicate = false;
		            	for (var j = 0; j < matches.length; j++) 
						{
		            		if(matches[j] == results[i]["PlaceOfOrigin"])
		            		{
		            			duplicate = true;
		            		}
		            	}
		            	if(duplicate == false)
		            	{
		            		matches.push(results[i]["PlaceOfOrigin"]);
		            	}
		            }
		            suggest(matches);
			    }
	    	});
	//When user clicks on search button, it will direct them to the map page where it displays products of that town, along with images of each item
	        $("#searchButton").click(function()
	        {
	            var options = 
				{
	              shouldSort: true,
	              threshold: 0.6,
	              location: 0,
	              distance: 100,
	              maxPatternLength: 32,
	              minMatchCharLength: 1,
	              keys: ["PlaceOfOrigin"]
	            };
				
			//selects product ID from Food Products table to displays that product on the map 
	            var fuse = new Fuse(data, options);
	            var result = fuse.search($("#pac-input").val());
	            window.location = "http://kunet.kingston.ac.uk/k1419859/UKMap.html?foodId=" + result[0]["ProductID"];
	        });

        });
})
