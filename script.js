
// This is my JavaScript File
var itemList = document.getElementsByClassName("scrollingMenu")[0];
$(document).ready(
  function () {
    $('.ui.dropdown')
    .dropdown(itemList);
   });

   var coordinatesArray = []

   var lat=40;
   var lon=-98.5;
   var zoom=4;
   var breweryName = "";
    
  // Search button click event
$("#search-button").on("click", function (e) {
  e.preventDefault()
  $(".warning").empty()

  var byCity = $("#city-input").val();
  var byState = $("#state-options").val();
  var byZip = $("#zipcode-input").val();
  var queryURL = "https://api.openbrewerydb.org/breweries?" + "by_city=" + byCity + "&by_state=" + byState + "&by_postal=" + byZip;

  console.log(byCity)
  console.log(byState)
  console.log(byZip)
  console.log(queryURL)


  // error message for when both city & state aren't inputted
  if ((byCity ==="" &&byState!=="") || (byCity!==""&&byState==="")) {
    let div = $("<div>")
    div.attr("class","warning")
    div.text("You must fill out state and city OR zip code")

    $("#state-input").append(div)

  }

  
  // if statement for search by city & state

  if ((byCity !== "" && byState !== "") && byZip === "") {

  $.ajax({
    url: queryURL,
    method: "GET"
  })

      .then(function (response) {
        $("#search-results").empty();
        console.log(queryURL);

        console.log(response);

        console.log()

        // for loop to loop thru results and display on page
        for (var i = 0; i < response.length; i++) {

          // Creating the cards if the response has a website URL
          if(response[i].website_url) {
          var temp = `<div class="ui cards">
        <div class="card">
          <div class="content">
    
            <div class="header">
              ${response[i].name}
            </div>
            <div class="description">
              Phone number: ${response[i].phone}
              <br>
              Address: ${response[i].street}
            </div>
          </div>
          
              <a href=${response[i].website_url} class="ui basic green button" target="_blank">Visit Website</a>
        </div>`
          }
          // Creating the cards if the response does not have a website URL
          else{
            var temp = `<div class="ui cards">
        <div class="card">
          <div class="content">
    
            <div class="header">
              ${response[i].name}
            </div>
            <div class="description">
            Phone number: ${response[i].phone}
            <br>
            Address: ${response[i].street}
            </div>
          </div>
        </div>`
          }

          $("#search-results").append(temp);

          // Sets the coordinates for the markers
          var nullCheck = response.latitude;
          if (nullCheck !== null) {
          var obj = {
            lat: response[i].latitude,
            lon: response[i].longitude
          }
          coordinatesArray.push(obj);
          //L.map('mapid').setView(coordinatesArray[0], 13);
          console.log(coordinatesArray[0]);
          //L.map('mapid').flyTo(coordinatesArray[0], 13);
          }
        }
        addMarker() 
      });
  }

 
function addMarker () {
  
  for (var i=0; i < coordinatesArray.length; i++) {
  
  lat = coordinatesArray[i].lat;
  lon = coordinatesArray[i].lon;
    if (lat !== null && lon !== null) {
  var marker = L.marker([lat, lon]).addTo(mymap);
  // var popup = L.popup()
  //   .setLatLng(latlng)
  //   .setContent('<p>Hello world!<br />This is a nice popup.</p>')
  //   .openOn(map);
  //marker.bindPopup(popupContent).openPopup();
}}};
  
  // if statement to search by zip code

  if ((byCity === "" && byState === "") && byZip !== "") {

    $.ajax({
      url: queryURL,
      method: "GET"
    })

      .then(function (response) {
        $("#search-results").empty();
        console.log(queryURL);

        console.log(response);

      

        // for loop to loop thru results and display on page
        for (var i = 0; i < response.length; i++) {

          breweryName = response[i];
          console.log(breweryName);

          // Creating the cards if the response has a website URL
          if(response[i].website_url) {
          var temp = `<div class="ui cards">
        <div class="card">
          <div class="content">
    
            <div class="header">
              ${response[i].name}
            </div>
            <div class="description">
            Phone number: ${response[i].phone}
            <br>
            Address: ${response[i].street}
            </div>
          </div>
          
              <a href=${response[i].website_url} class="ui basic green button" target="_blank">Visit Website</a>
        </div>`
          }
          // Creating the cards if the response does not have a website URL
          else{
            var temp = `<div class="ui cards">
        <div class="card">
          <div class="content">
    
            <div class="header">
              ${response[i].name}
            </div>
            <div class="description">
            Phone number: ${response[i].phone}
            <br>
            Address: ${response[i].street}
            </div>
          </div>
        </div>`
          }

          $("#search-results").append(temp);

          

          
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://us1.locationiq.com/v1/search.php?key=pk.5a1f2eca7f72d25b240f2c1c7c7ee282&q=" + breweryName.name + "," + breweryName.street + "," + breweryName.city + "," + breweryName.state + "&format=json",
            "method": "GET"
          }
          
          $.ajax(settings).done(function (response) {

            for(l=0; l < response.length; l++){
              console.log(response)
              console.log(response[l]);
              console.log(response[l].lat,",", response[l].lon)
              // Sets the coordinates for the markers - now getting response lat,lon
          var obj = {
            lat: response[l].lat,
            lon: response[l].lon
          }
          coordinatesArray.push(obj)
          console.log(coordinatesArray)
            }

          
            console.log(response[0].display_name, response[0].lat, response[0].lon);
            addMarker();
            
          });

        addMarker() 

      });
   }
});


    // Leaflet Formatting

    var mymap = L.map('mapid').setView([lat, lon], zoom);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2FyYWhzaGVhMTIiLCJhIjoiY2thdHNobmR4MGRxcTJxb2Nvc2l2MWUxOSJ9.Zlvr0sq1CQFluFfvrrg5UQ'
    }).addTo(mymap);

//About click event
$("#about-tab").on("click", function (e) {
  e.preventDefault()
  $("#about-display").show()
  $("#search-display").hide()
  //$("#contact-display").hide()
})
//Contact click event
$("#contact-tab").on("click", function (e) {
  e.preventDefault()
  $("#contact-display").show()
  $("#about-display").hide()
  $("#search-display").hide()
})
//Home-Search click event
$("#search-tab").on("click", function (e) {
  e.preventDefault()
  $("#contact-display").hide()
  $("#about-display").hide()
   $("#search-display").show()
})