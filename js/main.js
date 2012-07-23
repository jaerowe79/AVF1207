//AVF1207 
//Janis Jae Rowe



//*********************************************************************
// GEOLOCATION
//*********************************************************************
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

