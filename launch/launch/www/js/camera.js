// CAMERA/PHOTOS *******************************

var pictureSource;
var destinationType;

$('#photoPage').live('pageshow', function (event, ui){

    // Uncomment For Debugging
    // alert("PHOTO PAGE IS READY!");

    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
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

$("#capturePhoto").live('click', capturePhoto);

$("#capturePhotoEdit").live('click', capturePhotoEdit);

$("#getPhotoLibrary").live('click', function(){
    getPhoto(pictureSource.PHOTOLIBRARY);
});

$("#getPhotoAlbum").live('click', function(){
    getPhoto(pictureSource.SAVEDPHOTOALBUM);
});

