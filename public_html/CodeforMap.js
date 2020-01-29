/* global google */
function myMap() 
{
	var location = {lat: 54.5967591, lng: -4.3116372};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: location
     });

    var infoWindow = new google.maps.InfoWindow;

    var markers = [];
    var productCoords = [];

    var selectedMarker;

    var linkId = getUrlParams( "foodId" );
    //Requesting data from KUNET database
    $.ajax("http://kunet.kingston.ac.uk/k1419859/mapData.php")
        .done(function(data) 
		{
        	//Parse JSON data from server
            data = JSON.parse(data);
            console.log(data);
			
			
            //Loop over all food items
            for (var i = 0; i < data.length; i++) 
			{
            	//Check if image is undefined, if it is replace with blank string
                if(data[i]["Image"] == undefined)
                {
                    data[i]["Image"] = "";
                }
                //Create a new marker at position stored in database
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(data[i]["P_Latitude"]), lng: parseFloat(data[i]["P_Longitude"])},
                    map: map,
                    imageUrl: data[i]["Image"],
                    
                });
				
                //Add marker and coordinates to array
                markers.push(marker);
                productCoords.push({productName: data[i]["ProductName"], marker: marker});

                //Create infowindows to markers
               	//In function because of duplicate info window content error
                (function (marker, foodData) {
                //Create HTML for info window
                    var infoWindowContent = $('<div></div>');
                    var title = $('<b></b>').html(foodData["ProductName"]);
                    var imageUrl = $('<p></p>').html(foodData["ProductDescription"]);
                    infoWindowContent.append(title, imageUrl);

                    //Add click listener to show info window
                    marker.addListener('click', function() {
                        infoWindow.setContent($('<div>').append(infoWindowContent).html());
                        infoWindow.open(map, marker);
                        map.setCenter(marker["position"]);
                        map.setZoom(12);
                        selectedMarker = marker;
                    });
                })(marker, data[i]);

                //When coming from grid page, get food id from url, match to productId, and select that marker
                //http://kunet.kingston.ac.uk/k1419859/ukmap.html?foodId=10
                if(linkId != undefined && parseInt(data[i]["ProductID"]) == parseInt(linkId))
                {
                	selectedMarker == i;
                	new google.maps.event.trigger(marker, 'click');
                }
            }
        });
		
		//creates the dynamic layout as user scrolls through the map and images change accordingly 
        google.maps.event.addListener(map, 'bounds_changed', function() 
        {
            var imageMarkers = [];
            for (var i = 0; i < markers.length; i++) 
            {
                if (map.getBounds().contains(markers[i]["position"]) && markers[i]["imageUrl"] != "") 
                {
                    imageMarkers.push(markers[i]);
                } 
            }
            var loopCount = 10;
            if(imageMarkers.length < 10)
            {
                loopCount = imageMarkers.length;
            }

            $("#images").html("");

            for (var a = 0; a < loopCount; a++) {
               var img = $("<img>").attr("src", imageMarkers[a]["imageUrl"]).width(200).height(150);
               if(selectedMarker != undefined && imageMarkers[a]["position"] == selectedMarker["position"])
               {
               		img.addClass("selected");
               }

               img.on('click', {index: a}, function(e)
               {
               		map.setCenter(imageMarkers[e.data.index]["position"]);
               		map.setZoom(20);
               		new google.maps.event.trigger(imageMarkers[e.data.index], 'click' );
               })
               $("#images").append(img);
            }
        });
		
		
	//function which allows user to input a character / letter on the search bar to display the food product names which include that letter in them
        new autoComplete(
    	{
    		selector: $("#pac-input").get(0),
    		minChars: 1,
    		source: function(term, suggest){
		        var options = {
	              shouldSort: true,
	              threshold: 0.6,
	              location: 0,
	              distance: 100,
	              maxPatternLength: 32,
	              minMatchCharLength: 1,
	              keys: ["productName"]
	            };
	            console.log(productCoords);
	            var fuse = new Fuse(productCoords, options);
	            var results = fuse.search(term);
	            var matches = [];

	            for (var i = 0; i < results.length; i++) {
	            	matches.push(results[i]["productName"]);
	            }
	            suggest(matches);
		    }
    	});
		
		//When user clicks on search button, it will direct them to the map page where it displays product's details, along with images of that item
        $("#searchButton").click(function()
        {
            var options = {
              shouldSort: true,
              threshold: 0.6,
              location: 0,
              distance: 100,
              maxPatternLength: 32,
              minMatchCharLength: 1,
              keys: ["productName"]
            };
            var fuse = new Fuse(productCoords, options);
            var result = fuse.search($("#pac-input").val());
            map.setCenter(result[0]["marker"]["position"]);
            map.setZoom(8);
            new google.maps.event.trigger(result[0]["marker"], 'click');
        });
}

//function gets all parameters and returns it in prop
function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
}