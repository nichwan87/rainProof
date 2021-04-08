var ticketAPI = 'EMZOAA3KlATktn9bwYV8aKh7yFnEm92G';
var googleKey = 'AIzaSyBGnpmmzWpz-SVHgMnChfl2Vw3_jkf6cCk';
var page = 0;
var map;

// add Moment.js for current date 
// placeholder when page is loaded
$(document).ready(function() {
    
    $("#date").val(moment().format('YYYY-MM-DD')) 

})



/* locations dropdown opens on click */
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
  
});




/* show map when list item is clicked */
var listItem = document.querySelectorAll('.list-group-item')
listItem.forEach(function(el){
  el.addEventListener('click', function () {
    $('#map_div').show();
  });
});


/* hide map when back buttonis clicked */
var backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', function(event) {
    $('#map_div').hide();

});





// load events function depending on page
  function getEvents(page) {
//show hide panels 
  $('#events-panel').show();
  $('#attraction-panel').hide();


  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }



// main Events load
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?countryCode=AU&apikey=EMZOAA3KlATktn9bwYV8aKh7yFnEm92G&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
              /* console.log(json); */
  		   },

    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}




function showEvents(json) {
    var items = $('#events .list-group-item');
    items.hide();

    var events = json._embedded.events;
    var item = items.first();

    for (var i=0;i<events.length;i++) {
      item.children('.list-group-item-heading').text(events[i].name);
      item.children('.list-group-item-text').text(events[i].dates.start.localDate);
      try {
        item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
      } 
      catch (err) {
        console.log(err);
      }

      item.show();
      item.off("click");
      item.click(events[i], function(eventObject) {
        console.log(eventObject.data);
        try {
          getAttraction(eventObject.data._embedded.attractions[0].id);
        } 
        catch (err) {
        console.log(err);
        }
      });
      item=item.next();
    }
  }




// arrows on click change page up or down
$('#prev').click(function() {
    getEvents(--page);
    if (page = 1) {
        return;
      }
  
  });
  
  $('#next').click(function() {
    getEvents(++page);
  });
  





// loads a single event if clicked and show/hides panels
function getAttraction(id) {
    $.ajax({
      type:"GET",
      url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey=EMZOAA3KlATktn9bwYV8aKh7yFnEm92G",
      async:true,
      dataType: "json",
      success: function(json) {
            showAttraction(json);
               },
      error: function(xhr, status, err) {
                  console.log(err);
               }
    });
  }
  // shows the attraction panel for a clicked event
  function showAttraction(json) {
    $('#events-panel').hide();
    $('#attraction-panel').show();
    
    $('#backBtn').click(function() {
      getEvents(page);
    });
    
    $('#attraction .list-group-item-heading').first().text(json.name);
    $('#attraction img').first().attr('src',json.images[0].url);
    $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
    $('#ticketLink').text(json.url);
   /*  $('#infoText').text(json._embedded.events[0].address.line1); */
   
  }
  
  
  // initial call to load events
  getEvents(page);












/*
 * use google maps api built-in mechanism to attach dom events
 */
google.maps.event.addDomListener(window, "load", function () {

  /*
   * create map
   */
  var map = new google.maps.Map(document.getElementById("map_div"), {
    center: new google.maps.LatLng(33.808678, -117.918921),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  /*
   * create infowindow (which will be used by markers)
   */
  var infoWindow = new google.maps.InfoWindow();

  /*
   * marker creater function (acts as a closure for html parameter)
   */
  function createMarker(options, html) {
    var marker = new google.maps.Marker(options);
    if (html) {
      google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return marker;
  }

  /*
   * add markers to map
   */
  var marker0 = createMarker({
    position: new google.maps.LatLng(33.808678, -117.918921),
    map: map,
    icon: "http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png"
  }, "<h1>Marker 0</h1><p>This is the home marker.</p>");

  var marker1 = createMarker({
    position: new google.maps.LatLng(33.818038, -117.928492),
    map: map
  }, "<h1>Marker 1</h1><p>This is marker 1</p>");

  var marker2 = createMarker({
    position: new google.maps.LatLng(33.803333, -117.915278),
    map: map
  }, "<h1>Marker 2</h1><p>This is marker 2</p>");
});

