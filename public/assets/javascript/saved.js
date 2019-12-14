// FUNCTIONS
function saveUnsaveArticle (id, status) {
    // POST saved status
    $.ajax({
        method: "POST",
        url: "/save/" + id,
        data: {
            saved: status
        }
    });

}

// VARIABLES
var thisId;
var status;
var noteText;
var noteId;
var listItem;


// On click broken heart icon
$(document).on("click", "#fav-btn", function() {
    // Grab the id and value associated with the article from the heart button
    thisId = $(this).attr("data-id");
    status = $(this).attr("value");

    // Hide card when un-saved
    $(".card[data-id=" + thisId + "]").hide();

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

// On click note icon
$(document).on("click", "#note-btn", function() {
    // Empty the list-group and note-text textarea
    $('.list-group').empty();
    $('#note-text').val('');
    
    // Grab the id associated with the article
    thisId = $(this).attr("data-id");
    
    // Set modal title and show modal
    $('.modal-title').html('Notes for Article: <span id="id-span">' + thisId + '</span');
    $('#notes-modal').show();

    // Get route for all notes related to this headlineId
    $.ajax({
        method: "GET",
        url: "/notes/" + thisId
    }).then(function(response){
        // Check if there are notes, if not, notify in modal
        if (response.length === 0) {
            listItem = `<li id="no-notes" class="list-group-item">No notes have been added for this article.</li>`
            $('.list-group').append(listItem);
        } else {
            // Get all note IDs and texts, then add each item to the modal
            for (i in response) {
                noteText = response[i].noteText;
                noteId = response[i]._id;
                
                listItem = `<li data-id="${thisId}" class="list-group-item">${noteText} <button id="trash-btn" data-id="${noteId}" class="btn btn-sm float-right"><i class="fas fa-trash-alt"></i></button></li>`
                $('.list-group').append(listItem);
            
            }
        }
    });
});

// On click save notes button
$(document).on("click", "#save-btn", function() {
    // Grab the id associated with the article and the text in the text area
    thisId = $('#id-span').text();
    noteText = $('#note-text').val();

    // Delete no notes message if it exists
    if ($('#no-notes')) { $('#no-notes').remove(); }

    // Save note to DB
    $.ajax({
        method: "POST",
        url: "/addnote",
        data: {
            _headlineId: thisId,
            noteText: noteText
        }
    }).then(function(response) {
        // Add list item to modal
        listItem = `<li data-id="${response._id}" class="list-group-item">${noteText} <button id="trash-btn" data-id="${response._id}" class="btn btn-sm float-right"><i class="fas fa-trash-alt"></i></button></li>`
        $('.list-group').append(listItem);
        
        // Empty the note-text textarea
        $('#note-text').val('');
    })
});

// On click trashcan icon
$(document).on("click", "#trash-btn", function() {
    // Grab the note's id
    noteId = $(this).attr('data-id');
    console.log(noteId);

    // Hide card when un-saved
    $("li[data-id=" + noteId + "]").hide();

    $.ajax({
        method: "GET",
        url: "/deletenote/" + noteId
    }).then(function () {

    });
});