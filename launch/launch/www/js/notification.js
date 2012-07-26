// NOTIFICATIONS *************************

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