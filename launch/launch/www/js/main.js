//AVF1207 
//Janis Jae Rowe

// geolocation button click
    $('#geo').click(function () {
        // test for presence of geolocation
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geo_success, geo_error);
        } else {
            error('Geolocation is not supported.');
        }
    });
 
function geo_success(position) {
    printLatLong(position.coords.latitude, position.coords.longitude);
    
}

// The PositionError object returned contains the following attributes:
// code: a numeric response code
// PERMISSION_DENIED = 1
// POSITION_UNAVAILABLE = 2
// TIMEOUT = 3
// message: Primarily for debugging. It's recommended not to show this error
// to users.
function geo_error(err) {
    if (err.code == 1) {
        error('The user denied the request for location information.');
    } else if (err.code == 2) {
        error('Your location information is unavailable.');
    } else if (err.code == 3) {
        error('The request to get your location timed out.');
    } else {
        error('An unknown error occurred while requesting your location.');
    }
}


// output lat and long
function printLatLong(lat, long) {
    alert('You are at Latitude: ' + lat + ' and Longitude: ' + long);
}
 
function error(msg) {
    alert(msg);
}

//*********************************************************************
// CAMERA/PHOTOS
//*********************************************************************
var pictureSource;
var destinationType;

$('#photoPage').live('pageshow', function(event, ui){

    // Uncomment For Debugging
    // alert("PHOTO PAGE IS READY!");

    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
});

function onPhotoDataSuccess(imageData) {
    
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
}
    
function onPhotoURISuccess(imageURI) {
    
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}

var capturePhoto = function() {

    navigator.camera.getPicture(onPhotoDataSuccess, photosOnFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
}

var capturePhotoEdit = function() {

    navigator.camera.getPicture(onPhotoDataSuccess, photosOnFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
}

var getPhoto = function(source) {

    navigator.camera.getPicture(onPhotoURISuccess, photosOnFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

var photosOnFail = function(message) {
    alert('Failed because: ' + message);
}

$("#capturePhoto")    .live('click', capturePhoto);

$("#capturePhotoEdit").live('click', capturePhotoEdit);

$("#getPhotoLibrary") .live('click', function(){
    getPhoto(pictureSource.PHOTOLIBRARY);
});

$("#getPhotoAlbum")   .live('click', function(){
    getPhoto(pictureSource.SAVEDPHOTOALBUM);
});
//****************************************

//*********************************************************************
// CONTACTS
//*********************************************************************
var options;
var fields = ["displayName", "name", "phoneNumbers"];
var contactName;
var newContactName;
var newContactDisplayName;
var newContactNote;
var newContactPhone;

$('#contactsPage').live('pageshow', function(event, ui){
    
    // Uncomment For Debugging
     alert("FIND CONTACT PAGE READY");
    
    options               = new ContactFindOptions();
    contactsName          = $("#contactInput");
    newContactName        = $("#createContactInput");
    newContactDisplayName = $("#createContactDisplayName");
    newContactNote        = $("#createContactNote");
    newContactPhone       = $("#createContactPhone");
});

function focusTextField(){

    contactsName.focus();
}

function findContactOnSuccess(contacts) {
    
    if (contacts != null && contacts.length > 0) {
        for (var i=0; i<contacts.length; i++) {
            var phones = (contacts[i].phoneNumbers != null ? contacts[i].phoneNumbers : "No Phone Numbers");

            var setPhones = function(){
                if (phones != null && typeof(phones) != "string" && phones.length >= 1) {
                    
                    var phoneStringToReturn = "";
                        
                        for (index in phones) {
                            if (index == phones.length - 1) {
                                phoneStringToReturn += phones[index].value;
                            } else {
                                phoneStringToReturn += phones[index].value + ", ";
                            }
                        }
                    
                    return phoneStringToReturn;
                } else {
                    return phones;
                }
            }
            $("#contactsDiv").append("Name: "            + contacts[i].name.formatted     + " <br /> " +
                                     "Phone Number(s): " + setPhones() + " <br /> " +
                                     "<hr>");
        }
    } else {
        navigator.notification.alert(
            'No Contacts Found For: ' + options.filter,
            focusTextField,
            'Sorry',
            'Ok'
        );
    }
}

function findContactOnError(contactError) {
    
    alert('Sorry! An Error has occurred. ' + contactError);
}

$('#findContact').live('click', function() {
                       
    options.filter = contactsName.val();
    options.multiple = true;
    if (options.filter != null && options.filter.length > 0){
        navigator.contacts.find(fields, findContactOnSuccess, findContactOnError, options);
    } else {
        navigator.notification.alert(
            'Please enter a name to search for contacts.',
            focusTextField,
            'Oops!',
            'Ok'
        );
    }
});

// STORE A CONTACT ***************************************
var focusNewContactNameField = function(){
    newContactName.focus();
}

var newContactSuccess = function(){
    navigator.notification.alert(
        'Contact Added Successfully!',
        focusNewContactNameField,
        'Success',
        'Ok'
    );
}

var newContactError = function(error){
    navigator.notification.alert(
        'Contact could not be saved. ' + error,
        focusNewContactNameField,
        'Error',
        'Ok'
    );
}

$('#createContact').live('click', function() {
                         
    if (newContactName.val()        == "" ||
        newContactDisplayName.val() == "" ||
        newContactNote.val()        == "" ||
        newContactPhone.val()       == "") {

        navigator.notification.alert(
            'All fields are required.',
            focusNewContactNameField,
            'Error',
            'Ok'
        );
    } else {
        var myContact = navigator.contacts.create({
            "name"        : newContactName.val(),
            "displayName" : newContactDisplayName.val(),
            "note"        : newContactNote.val(),
            "phoneNumbers": [ new ContactField('default', newContactPhone.val(), 'true' ) ]
        });
        myContact.save(newContactSuccess, newContactError);
    }
 });
 
 //*********************************************************************
// NOTIFICATIONS
//*********************************************************************
var notificationBtn = $('#notification');

notificationBtn.live('click', function(){
    function alertDismissed() {
        // do nothing
        console.log("Dismissed");
    }

    navigator.notification.alert(
        'You are the winner!',  // message
        alertDismissed(),       // callback
        'Game Over',            // title
        'Done'                  // buttonName
    );
});


