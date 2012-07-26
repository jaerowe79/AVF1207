//AVF1207 
//Janis Jae Rowe

// CONTACTS ***********************************

var options;
var fields = ["displayName", "name", "phoneNumbers"];
var contactName;
var newContactName;
var newContactDisplayName;
var newContactNote;
var newContactPhone;

$('#contactsPage').live('pageshow', function(event, ui){
    
    // Uncomment For Debugging
     //alert("FIND CONTACT PAGE READY");
    
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
 




