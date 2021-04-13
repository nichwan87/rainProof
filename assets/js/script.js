var ticketAPI = 'EMZOAA3KlATktn9bwYV8aKh7yFnEm92G';
var page = 0;
var map;
var newSelectedDate;



/* locations dropdown opens on click */
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
});

/* show map when list item is clicked */
var listItem = document.querySelectorAll('.list-group-item')
listItem.forEach(function (el) {
    el.addEventListener('click', function () {
        $('#map_div').show();
    });
});

/* hide map when back buttonis clicked */
var backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', function () {
    $('#map_div').hide();

});

// current date placeholder when page is loaded
var date = moment()
$("#datePicker").val(date.format('YYYY-MM-DD'));

function fetchTicketMasterData() {

    // datepicker
    var newDate = moment(this.value || Date.now()).format("YYYY-MM-DDTHH:mm:ss") + "Z";
    console.log(newDate)

    // statepicker
    selectState = document.getElementById("dropDowncontainer").value;
    console.log(selectState)


    // getEvents function loads data and show/hides
    function getEvents() {
        //show hide panels 
        $('#events-panel').show();
        $('#attraction-panel').hide();
        $('#datecontainer').show();
        $('#dropDowncontainer').show();

        // main Events load
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=AU&sort=date,asc&startDateTime=" + newDate + "&stateCode=" + selectState + "&apikey=EMZOAA3KlATktn9bwYV8aKh7yFnEm92G&page=" + page,
            async: true,
            dataType: "json",
            success: function (json) {
                var items = $('#events .list-group-item');
                items.hide();

                var events = json._embedded.events;
                var item = items.first();

                for (var i = 0; i < events.length; i++) {
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
                    item.click(events[i], function (eventObject) {
                        console.log(eventObject.data);
                        try {
                            getAttraction(eventObject.data._embedded.attractions[0].id, eventObject.data);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    });
                    item = item.next();
                }

                console.log(json);
            },


            error: function (xhr, status, err) {
                console.log(err);
            }

        });

    }




    // arrows on click change page up or down
    $('#prev').click(function () {
        getEvents(page--);
        console.log(page);
        if (page < 1) page = 1;

    });

    $('#next').click(function () {

        getEvents(page++);
        console.log(page);

    });


    // call to load events
    getEvents();




    // loads a single event when clicked and show/hides panels
    function getAttraction(id, event) {
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/attractions/" + id + ".json?apikey=EMZOAA3KlATktn9bwYV8aKh7yFnEm92G",
            async: true,
            dataType: "json",
            success: function (json) {
                showAttraction(event);
            },
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }

    // shows the attraction panel for a clicked event
    function showAttraction(json) {
        $('#datecontainer').hide();
        $('#dropDowncontainer').hide();
        $('#events-panel').hide();
        $('#attraction-panel').show();
        $('#backBtn').click(function () {
            getEvents();
        });
        $('#choosenTitle').text(json._embedded.attractions[0].name);
        $('#attraction .list-group-item-heading').first().text(json.name);
        $('#attraction img').first().attr('src', json.images[0].url);
        $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
        $('#venueText').text(json._embedded.venues[0].name);
        $('#infoText').text(json.info);
        $('#ticketLink').first().attr('href', json.url);
        $('#location').text(json._embedded.venues[0].location.latitude + "_" + json._embedded.venues[0].location.longitude);
        console.log(json._embedded.venues[0].name);
        /* load google map */
        showMap()

    }

}

fetchTicketMasterData()


/// date picker on change updates date variable and load API
document.getElementById("datePicker").addEventListener("change", fetchTicketMasterData);


/* document.getElementById("dropDowncontainer").addEventListener("change", fetchTicketMasterData); */

/* document.getElementById("dropDowncontainer").addEventListener("change", fetchTicketMasterData); */



function showMap() {
    /* google.maps.event.addDomListener(document.querySelector("#loadMap"), "click", function () { */

    /*
     * create map
     */

    var location = $('#location').text().split('_');
    var map = new google.maps.Map(document.getElementById("map_div"), {
        //center: new google.maps.LatLng(33.808678, -117.918921),
        center: new google.maps.LatLng(location[0], location[1]),
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

    var location = $('#location').text().split('_');
    var marker1 = createMarker({
        //position: new google.maps.LatLng(33.818038, -117.928492),
        position: new google.maps.LatLng(location[0], location[1]),
        map: map
    }, "<h1>Marker 1</h1><p>This is marker 1</p>");
};

