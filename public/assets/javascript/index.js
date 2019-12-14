// FUNCTIONS
function saveUnsaveArticle (id, status) {

    $.ajax({
        method: "POST",
        url: "/save/" + id,
        data: {
            saved: status
        }
    });

}

$(document).on("click", "#fav-btn", function() {
    // Grab the id and value associated with the article from the heart button
    var thisId = $(this).attr("data-id");
    var status = $(this).attr("value");

    // Set opposite saved status and value
    if (status === 'true') {
        status = false;
        $(this).attr("value", "false");
        $(this).html('<i class="far fa-heart"></i>');
        saveUnsaveArticle(thisId, status);
    } else {
        status = true;
        $(this).attr("value", "true");
        $(this).html('<i class="fas fa-heart"></i>');
        saveUnsaveArticle(thisId, status);
    }
});