// Message box appears asking user if they are sure they want to delete client

var deleteButtons = document.getElementsByClassName("delete_button");

for (var x=0; x < deleteButtons.length; x++) {
    deleteButtons[x].addEventListener("click", function(event) {
        var sure = confirm("Are you sure you want to delete this user?");
        if (!sure) {
            event.preventDefault();
        }
    });
}

delete_button.addEventListener("click", function(event){
    var sure = confirm("Are you sure?");
    if (!sure) {
        event.preventDefault();   // Button not clicked so no request sent to the server
    }
});
