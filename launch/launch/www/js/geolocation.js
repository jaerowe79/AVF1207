// GEOLOCATION ***************************

$('#geolocationPage').live('pageshow', function(event, ui){

    // Uncomment For Debugging
    // alert("GEOLOCATION PAGE IS READY!");
});

var geoOnSuccess = function(position) {
    var geolocationDiv = $('#geolocationDiv');
    geolocationDiv.append( 'Latitude: ' + position.coords.latitude + '<br />' +
    'Longitude: '          + position.coords.longitude             + '<br />' +
    'Altitude: '           + position.coords.altitude              + '<br />' +
    'Accuracy: '           + position.coords.accuracy              + '<br />' +
    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    'Heading: '            + position.coords.heading               + '<br />' +
    'Speed: '              + position.coords.speed                 + '<br />' +
    'Timestamp: '          + new Date(position.timestamp)          + '<br />' +
    '<hr>');
};

var geoOnError = function(error) {
    alert('code: ' + error.code    + '\n' +
    'message: ' + error.message + '\n');
}

$('#geolocationBtn').live('click', function(){
    navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
});
