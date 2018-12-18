function mapsAPIError(){
    alert("Failed to load maps from Google Maps!");
}

var styles =
[
{
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [
        {
            "weight": "2.00"
        }
    ]
},
{
    "featureType": "all",
    "elementType": "geometry.stroke",
    "stylers": [
        {
            "color": "#9c9c9c"
        }
    ]
},
{
    "featureType": "all",
    "elementType": "labels.text",
    "stylers": [
        {
            "visibility": "on"
        }
    ]
},
{
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
        {
            "color": "#f2f2f2"
        }
    ]
},
{
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
        {
            "color": "#ffffff"
        }
    ]
},
{
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
        {
            "color": "#ffffff"
        }
    ]
},
{
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
},
{
    "featureType": "road",
    "elementType": "all",
    "stylers": [
        {
            "saturation": -100
        },
        {
            "lightness": 45
        }
    ]
},
{
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
        {
            "color": "#eeeeee"
        }
    ]
},
{
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
        {
            "color": "#7b7b7b"
        }
    ]
},
{
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
        {
            "color": "#ffffff"
        }
    ]
},
{
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "simplified"
        }
    ]
},
{
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
},
{
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
},
{
    "featureType": "water",
    "elementType": "all",
    "stylers": [
        {
            "color": "#46bcec"
        },
        {
            "visibility": "on"
        }
    ]
},
{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
        {
            "color": "#c8d7d4"
        }
    ]
},
{
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
        {
            "color": "#070707"
        }
    ]
},
{
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
        {
            "color": "#ffffff"
        }
    ]
}
]

// Creating necessary variables
var map;
var marker;
// Create a new blank array for all the listing markers.
var markers = [];
// Array of locations of interest with latitude and longitude values

function initMap(){

// Creating an array for styling the map

    // The below constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 11.016845, lng: 76.955832},
    zoom: 12,
    styles: styles,
    mapTypeControl: false
    });
    placeMarkers(locations);
    drawMap();
}

// Creating array with marker properties

var locations = [
    {title:'Valparai',coordinates:{lat:10.323591,lng:76.951003},id: "nav0",
    visible: ko.observable(true),isValid: true},
    {title:'Ooty',coordinates:{lat:11.406414,lng:76.693244},id: "nav1",
    visible: ko.observable(true),isValid: true},
    {title:'Palakkad',coordinates:{lat: 10.78673,lng: 76.654793},id: "nav2",
    visible: ko.observable(true),isValid: true},
    {title:'Kodaikanal',coordinates:{lat: 10.238114,lng: 77.489182},id: "nav3",
    visible: ko.observable(true),isValid: true},
    {title:'Munnar',coordinates:{lat: 10.088933,lng: 77.059525},id: "nav4",
    visible: ko.observable(true),isValid: true}
    ];

// Defining function that places markers(i.e. as per locations[]) on map

function placeMarkers(locations){
  // To Add Info Window For Each Marker
    var markerInfoPopup = new google.maps.InfoWindow();
 // Color value for default marker
    var defaultIcon = makeMarkerIcon('708090');
    // Color value, activated during mouseover event
    var highlightedIcon = makeMarkerIcon('009ACD');

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) {
        locations[i].currentMarker = new google.maps.Marker({
        position :locations[i].coordinates,
        lat : locations[i].coordinates.lat,
        lng : locations[i].coordinates.lng,
        title :locations[i].title,
        animation : google.maps.Animation.DROP,
        icon: defaultIcon,
        id : i
        });
        markers.push(locations[i].currentMarker);
        locations[i].currentMarker.setMap(map);
        // Adjusts the boundaries of the map as per marker locations
        bounds.extend(locations[i].currentMarker.position);
        // Adding Click Event Functionality to the marker
        locations[i].currentMarker.addListener('click',function(){
            createInfoPopup(this,markerInfoPopup);
        });
        // Event listeners, mouseover & mouseout,for changing colors
        locations[i].currentMarker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        locations[i].currentMarker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        // Function to display map properties as per marker
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
            return function() {
                markerInfoPopup.setContent(createInfoPopup(marker,markerInfoPopup));
                markerInfoPopup.open(map,marker);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
            };
        })
        (locations[i].currentMarker, i));
        google.maps.event.addListener(locations[i].currentMarker, 'click', bounce);
        };
    // Adjusts the boundaries of the map to fit markers
    map.fitBounds(bounds);
}

// Function definition to create marker image

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(20, 30),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(20,30));
  return markerImage;
}

// Bounce Animation for marker
function bounce() {
  if (this.getAnimation() != null) {
    this.setAnimation(null);
  } else {
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1000);
  }
}

// Defining pop-up window for markers
function createInfoPopup(marker, infowindow){
    infowindow.marker = marker;
    wikipediaArt(marker.title);
    marker.contentStr= '<div><a target="_blank" id="wikiArticle" href="">'+marker.title+ ' on Wikipedia';
    infowindow.setContent(marker.contentStr);
    infowindow.open(map,marker);
      // Make sure that marker property is cleared if the info window is closed
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
      });
    return marker.contentStr;

  };

  // Function definition to fetch wikipedia article
  function wikipediaArt(location){
    // var wikiRequestTimeout = setTimeout(function(){
    //       alert("Failed to get Wikipedia Resources");
    //   },4000);
    var wiki_url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+location+
    '&limit=3&callback=wikiCallback';
    $.ajax({
      url: wiki_url,
      dataType: "jsonp",
      success:function(response){
        var articleList = response[3];
        $("#wikiArticle").attr("href",articleList[0]);
        // clearTimeout(wikiRequestTimeout);
      },
      error: function(response){
         alert("Failed to get Wikipedia Resources");
         $("#wikiArticle").removeAttr("href");
      }
      })
    }

// Definition to render the map as per map object properties

function drawMap() {
  for (var i = 0; i < locations.length; i++) {
    if(locations[i].isValid === true) {
    locations[i].currentMarker.setMap(map);
    } else {
    locations[i].currentMarker.setMap(null);
    }
  }
}

// Assigning search item as Knockout observable

var viewModel = {
    searchTerm: ko.observable(''),
};

/*
Method to serach available list items,
by using Knockout's arrayFilter method
*/

viewModel.locations = ko.dependentObservable(function() {
  var self = this;
  var search = self.searchTerm().toLowerCase();
  return ko.utils.arrayFilter(locations, function(location) {
  if (location.title.toLowerCase().indexOf(search) >= 0) {
          location.isValid = true;
          return location.visible(true);
      } else {
          location.isValid = false;
          drawMap();
          return location.visible(false);
      }
  });
}, viewModel);

// Finally, launching the app with Knockout.js

ko.applyBindings(viewModel);

$("#input").keyup(function() {
drawMap();
});
