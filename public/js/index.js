var MAX_BOOKMARKS = 9;

function toggleLoadGIF() {
    var load_gif = $("#load-gif");
    if(load_gif.css('display') == 'none') {
        load_gif.css('display', 'block');
    } else {
        load_gif.css('display', 'none');
    }
};

// Local bookmarks
var current_bookmarks = {};

window.onload = function() {
    /*************************** AJAX **********************************/
    // Grab bookmarks from the first load using AJAX request
    (function() {
        toggleLoadGIF();
        $.ajax({
            cache: false,
            type: 'GET',
            url: '/list',
            contentType: 'application/json',
            dataType: 'json',
            data: '',
            success: function(result) {
                // Update local bookmarks
                current_bookmarks = result.data.bookmarks;
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                var err_msg = '';
                if(err.msg == null) {
                    showErrorModal("Error", err.data);
                } else {
                    for(var i = 0; i < err.msg.length; i++) {
                        // Combine all error messages to display in one modal
                        err_msg += err.msg[i].msg += '\n';
                    }
                    showErrorModal("Error", err_msg);
                }
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    })();

    // Create new bookmark
    $("#addBookmarkForm").on("submit", function(event) {
        event.preventDefault();

        toggleLoadGIF();

        var url = $("#addBookmarkForm").attr("action");
        var params = {
            "title": $("#addBookmarkForm input[name='title']").val().trim(),
            "url" : $("#addBookmarkForm input[name='url']").val().trim(),
            "description": $("#addBookmarkForm input[name='description']").val().trim(),
            "folder_id": $("#addBookmarkForm select[name='folder_id']").val().trim()
        };

        $.ajax({
            cache: false,
            type: 'POST',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(result) {
                // Close addBookmark modal
                window.location.hash = "close";

                var bookmark = result.data;
                var current_folder = $("#currentFolder").val();

                // Add bookmark to list if it belongs to currently selected folder or all-list
                if(current_folder == bookmark.folder_id || current_folder == '') {
                    var bookmark_html = addBookmarkHTML([bookmark]);  // pass bookmark as array to function
                    $('#bookmarks').append(bookmark_html);
                }
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });

        return false;
    });

    // Star/unstar bookmark
    $("#bookmarks").on("click", ".card__action-bar a:nth-of-type(1)", function(event) {
        event.preventDefault();

        toggleLoadGIF();

        var url = $(this).attr("href");
        var params = {"bookmark_id" : $(this).attr("id").split("-")[2]};

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: params,
            success: function(result) {
                var data = result.data;

                // Style the star
                var star = $("#star-bookmark-" + data.bookmark_id);
                var child_i = $("#star-bookmark-" + data.bookmark_id + " > i");
                child_i.toggleClass("fa-star-inactive");

                // Update star anchor href
                if(child_i.hasClass("fa-star-inactive")) {
                    star.attr("href", "/bookmarks/" + data.bookmark_id + "/star");
                } else {
                    star.attr("href", "/bookmarks/" + data.bookmark_id + "/unstar");
                }
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    });

    // Delete modal warning
    $("#bookmarks").on("click", ".card__action-bar a:nth-of-type(3)", function(event) {
        event.preventDefault();

        window.location.hash = 'confirmDelete';  // show error modal
        var bookmark_id = $(this).attr("id").split("-")[2];

        // Handler for confirm delete on error modal form
        $("#confirmDeleteForm").on("submit", function(event) {
           event.preventDefault();
           toggleLoadGIF();

            $.ajax({
                type: 'GET',
                url: "/bookmarks/delete/" + bookmark_id,
                dataType: 'json',
                contentType: 'application/json',
                success: function(result) {
                   // Remove bookmark from list
                     var data = result.data;
                     window.location.hash = "close";
                   $("#bookmark-card-" + data.bookmark_id).closest("div.col-1-3.mobile-col-1-3.card-min-width").remove();
                },
                error: function(xhr, status, error) {
                    var err = JSON.parse(xhr.responseText);
                    showErrorModal("Error", err.data);
                },
                complete: function(xhr, status) {
                    toggleLoadGIF();
                }
            });
        });
    });


    // Create new folder
    $("#addFolderForm").on("submit", function(event) {
        event.preventDefault();

        toggleLoadGIF();

        var url = $("#addFolderForm").attr("action");
        var params = {
            "name": $("#addFolderName").val().trim()
        };

        $.ajax({
            cache: false,
            type: 'POST',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(result) {
                // Close addFolder modal
                window.location.hash = "close";

                var data = result.data;

                // Hide folder-placeholder
                $('#folder-placeholder').css('display', 'none');

        		// Append folder to sidebar
        		$('#folderList').append(
	            	'<li><a id="folder-' + data.folder_id + '" href="/list/' + data.folder_id + '">' + data.folder_name + '</a>\n' +
	                '    <a class="pad-trash-icon" href="/folders/delete/' + data.folder_id + '" id="delete-folder-' + data.folder_id + '"><i class="fa fa-trash-o fa-lg"></i></a>\n' +
	                '</li>'
				);

                // Add folder into the addBookmark and editBookmark modals' folder selection
                $('#addBookmarkForm select[name="folder_id"]').append(
                    '<option value="' + data.folder_id + '">' + data.folder_name + '</option>'
                );
                $('#editBookmarkForm select[name="folder_id"]').append(
                    '<option value="' + data.folder_id + '">' + data.folder_name + '</option>'
                );
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });

        return false;
    });


    // Delete folder
    $("#folderList").on("click", ".pad-trash-icon", function(event) {
        event.preventDefault();
        window.location.hash = 'confirmDelete';

        var url = $(this).attr("href");
        var params = {"folder_id" : $(this).attr("id").split("-")[2]};

        // Handler for folder delete modal form
        $("#confirmDeleteForm").on("submit", function(event) {
            event.preventDefault();

            // Close the modal
            window.location.hash="close";
            toggleLoadGIF();

            $.ajax({
                type: 'GET',
                url: url,
                contentType: 'application/json',
                dataType: 'json',
                data: params,
                success: function(result) {
                    var data = result.data;
                    var current_folder = $("#currentFolder").val();

                    // Remove folder from side list
                    $("#delete-folder-" + data.folder_id).closest("li").remove();

                    // Display folder placeholder if no more folders besides default (starred, all)
                    if($("#folderList > li").length == 2) {
                        $("#folder-placeholder").css('display', 'block');
                    }

                    if(current_folder == '' || current_folder == 'starred') {
                        // If current folder is 'all' or 'starred', fetch bookmark list by triggering folder click
                        $("#folder-" + current_folder).click();
                    } else if(current_folder == data.folder_id) {
                        // If current folder is the deleted folder, clear bookmark list
                        $("#bookmarks").html('');
                    }

                    // Remove folder from the addBookmark and editBookmark modals
                    $('#addBookmarkForm select[name="folder_id"] option[value=' + data.folder_id + ']').remove();
                    $('#editBookmarkForm select[name="folder_id"] option[value=' + data.folder_id + ']').remove();
                },
                error: function(xhr, status, error) {
                    var err = JSON.parse(xhr.responseText);
                    showErrorModal("Error", err.data);
                },
                complete: function(xhr, status) {
                    toggleLoadGIF();
                }
            });

        return false;
        });
    });

    // Select folder (list bookmarks from that folder)
    $("#folderList").on("click", "li a:nth-of-type(1)", function(event) {
        event.preventDefault();

        toggleLoadGIF();

        var curr_folder = $(this).attr("id") ? $(this).attr("id").split("-")[1] : '';
        var prev_folder = $("#currentFolder").val();

        if(curr_folder=='starred'){
            var url = "/list";
            var star=1;
        }
        else {
            var url = "/list/" + curr_folder;
            var star = 0;
        }

        var params = {
            "folder_id": curr_folder,
            "Star":      star
        };

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: params,
            success: function(result) {
                // Un-highlight prev folder, highlight curr folder
                $('#folder-' + prev_folder).addClass('inactive-folder').removeClass('active-folder');
                $('#folder-' + curr_folder).addClass('active-folder').removeClass('inactive-folder');

                // Update current folder hidden input field
                $('#currentFolder').val(curr_folder);

                // Clear search and sort options
                $('#searchForm input[name="Search"]').val('');
                $('#orderByForm select[name="SortBy"]').val('Sort');

                // Show bookmarks of the selected folder
                var bookmarks = result.data.bookmarks;

                // Store current bookmarks locally
                current_bookmarks = bookmarks;

                // Update client-side list
                var bookmark_list = addBookmarkHTML(bookmarks);
                $('#bookmarks').html(bookmark_list);

                // Update pagination
                var num_pagination = Math.ceil(result.data.count/MAX_BOOKMARKS);
                var paginations_html="";
                for(var i = 1; i <= num_pagination; i++) {
                    paginations_html+= '<a href="/list"'+(star == 1 ? "": '/' + curr_folder) +
                        '?&offset='+i+ '&Star=' + star +'> '+ i+'  </a>';
                }
                $('#pagination').html(paginations_html);
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    });

    // Callback function for keyword search and/or sort (in current folder)
    var sortOrSearchFunction = function(event) {
        event.preventDefault();
        toggleLoadGIF();
        //var curr_folder = $(this).attr("id") ? $(this).attr("id").split("-")[1] : '';
        var curr_folder = $('#currentFolder').val();
        if (curr_folder == "starred") {
            var url = "/bookmarks/getCount";
            var star = 1;
        }
        else {
            var url = "/bookmarks/getCount" + "/" + curr_folder;
            var star = 0;
        }

        var search_text = $('#searchForm input[name="Search"]').val();
        var sort_option = $('#orderByForm select[name="SortBy"]').val();
        var offset_index = $(this).text();
        var params = {
            "Search": search_text,
            "SortBy": sort_option,
            "offset": offset_index,
            "Star":   star
        };
        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: params,
            success: function (result) {
                var num_pagination = Math.ceil(result.data.count/MAX_BOOKMARKS);
                var paginations_html="";
                for(var i = 1; i <= num_pagination; i++) {
                    paginations_html+= '<a href="/list/"' + (star == 1 ? "" : curr_folder) + '?Search=' + search_text +
                        '&SortBy=' + sort_option + '&offset=' + i + '&Star=' + star + '> ' + i+ ' </a>';
                }
                $('#pagination').html(paginations_html);
            }
        });

        var curr_folder = $("#currentFolder").val();
        if (curr_folder == "starred") {
            var url = "/list";
            var star = 1;
        }
        else {
            var url = "/list/" + curr_folder;
            var star = 0;
        }

        var search_text = $('#searchForm input[name="Search"]').val();
        var sort_option = $('#orderByForm select[name="SortBy"]').val();
        var params = {
            "folder_id": curr_folder,
            "Search": search_text,
            "SortBy": sort_option,
            "Star":   star
        };

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: params,
            success: function(result) {

                // Show bookmarks of the selected folder
                var bookmarks = result.data.bookmarks;

                // Store current bookmarks
                current_bookmarks = bookmarks;

                // Update
                var bookmark_list = addBookmarkHTML(bookmarks);
                $('#bookmarks').html(bookmark_list);
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });

        return false;
    };

    // Add event handlers to search and sort
    $('#searchButton').on("click", sortOrSearchFunction);
    $('#orderByForm select[name="SortBy"]').on("change", sortOrSearchFunction);


    // Dynamically populate editBookmark modal when clicked
    $("#bookmarks").on("click", ".card__action-bar a:nth-of-type(2)", function(event) {
        for(var i = 0; i < current_bookmarks.length; i++) {
            event.preventDefault();

            var bookmark_id = $(this).attr('id').split('-')[2];
            if(bookmark_id == current_bookmarks[i].id) {
                $('#editBookmarkForm').attr('action', '/bookmarks/update/' + current_bookmarks[i].id);
                $('#editBookmarkForm input[name="title"]').val(current_bookmarks[i].title);
                $('#editBookmarkForm input[name="url"]').val(current_bookmarks[i].url);
                $('#editBookmarkForm input[name="description"]').val(current_bookmarks[i].description);
                $('#editBookmarkForm select[name="folder_id"]').val(current_bookmarks[i].folder_id);
                window.location.hash = "editBookmark";
                return;
            }

        }
    });

    // Edit bookmark
    $("#editBookmarkForm").on("submit", function(event) {
            event.preventDefault();
            toggleLoadGIF();

            var bookmark_id = $('#editBookmarkForm').attr('action').split('/')[3];
            var newTitle = $('#editBookmarkForm input[name="title"]').val();
            var newUrl = $('#editBookmarkForm input[name="url"]').val();
            var newDescription = $('#editBookmarkForm input[name="description"]').val();
            var newFolderId = $('#editBookmarkForm select[name="folder_id"]').val();
            var params = {
                bookmark_id: bookmark_id,
                title: newTitle,
                url: newUrl,
                description: newDescription,
                folder_id: newFolderId
            };

            $.ajax({
                type: 'POST',
                url: "/bookmarks/update/" + bookmark_id,
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json',
                success: function(result) {
                    // Close edit bookmark modal
                    window.location.hash = "close";

                    // Update local bookmark
                    var data = result.data;

                    for(var i = 0; i < current_bookmarks.length; i++) {
                        if(data.bookmark_id == current_bookmarks[i].id) {
                            current_bookmarks[i].title = data.title;
                            current_bookmarks[i].url = data.url;
                            current_bookmarks[i].description = data.description;
                            current_bookmarks[i].folder_id = data.folder_id;
                            break;
                        }
                    }

                    // Update bookmark dynamically
                    $('#title-bookmark-' + data.bookmark_id).text(data.title);
                    $('#bookmark-url-' + data.bookmark_id).attr('href', data.url);
                },
                error: function(xhr, status, error) {
                    var err = JSON.parse(xhr.responseText);
                    showErrorModal("Error", err.data);
                },
                complete: function(xhr, status) {
                    toggleLoadGIF();
                }
            });

            return false;
    });

    // For last visit update.
    // When click a bookmark, will send a request to update the last visit time.
    $("#bookmarks").on("click", ".bookmark-link", function(event) {
        event.preventDefault();
        toggleLoadGIF();

        var url = "/bookmarks/last_visit";
        var params = {"bookmark_id" : $(this).attr("id").split("-")[1]};
        var bookmark_url = $(this).attr("href");

        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(result) {
                var data = result.data;
                window.location.href = bookmark_url;
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    });

    // For pagination
    $("#pagination").on("click", "a", function(event) {
        event.preventDefault();
        toggleLoadGIF();

        var curr_folder = $("#currentFolder").val();
        if(curr_folder=='starred'){
            var star = 1;
            var url = "/list";
        }
        else {
            var star = 0;
            var url = "/list/" + curr_folder;
        }
        var search_text = $('#searchForm input[name="Search"]').val();
        var sort_option = $('#orderByForm select[name="SortBy"]').val();
        var offset_index = $(this).text();
        var params = {
            "folder_id": curr_folder,
            "Search": search_text,
            "SortBy": sort_option,
            "offset": offset_index,
            "Star":   star
        };
        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: params,
            success: function(result) {
                // Show bookmarks of the selected folder
                var bookmarks = result.data.bookmarks;

                // Store current bookmarks
                current_bookmarks = bookmarks;

                // Update 
                var bookmark_list = addBookmarkHTML(bookmarks);
                $('#bookmarks').html(bookmark_list);
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    });


    //Change Password
    $("#resetPassword").on("submit", function (event) {
        event.preventDefault();

        toggleLoadGIF();

        window.location.hash = "close";  // close the modal
        var url = '/passwordReset';
        var params = {
            "password" : document.getElementById("password").value,
            "confirm_password" : document.getElementById("confirm_password").value
        };

        $.ajax({
            cache: false,
            type: 'POST',
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(result) {
                // show success msg
                showErrorModal("Success", "Password reset successfully!");
            },
            error: function(xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                showErrorModal("Error", err.data);
            },
            complete: function(xhr, status) {
                toggleLoadGIF();
            }
        });
    });

    /*******************************************************************/


    /*************************** For styling ********************************/
    var menuButton = document.getElementById("menu");
    var sidebar = document.getElementById("sidebar");
    var menuIcon = document.getElementById("menu-icon");

    menuButton.onclick = function() {
        var right = document.getElementById("right");
        if(sidebar.style.display !== 'none'){
            sidebar.style.display = 'none';
            right.style.width = '100%';
            menuButton.style.color = "#FFF";
        }
        else {
            sidebar.style.display = 'block';
            right.style.width = '82%';
            menuButton.style.color = "#FF9EAE";
        }
    };

    var addBookmark = document.getElementById("add-bookmark");
    var addBookmark1 = document.getElementById("add-bookmark1");
  var addBookmark2 = document.getElementById("add-bookmark2");
    var importBookmark = document.getElementById("import-bookmark");
    var addBookmarkForm = document.getElementById("add-bookmark-form");
    var addBookmarkForm1 = document.getElementById("add-bookmark-form1");
  var addBookmarkForm2 = document.getElementById("add-bookmark-form2");
    var importBookmarkForm = document.getElementById("import-bookmark-form");

    addBookmark.onclick = function() {
        console.log(addBookmark);
        importBookmarkForm.style.display = 'none';
        addBookmarkForm.style.display = 'block';
        addBookmarkForm1.style.display = 'block';
    addBookmarkForm2.style.display = 'block';

        importBookmark.className = "";

        addBookmark.className = "";
        addBookmark.className = "is-active";

    }

    addBookmark1.onclick = function() {
        importBookmarkForm.style.display = 'none';
        addBookmarkForm.style.display = 'block';
        addBookmarkForm1.style.display = 'block';
    addBookmarkForm2.style.display = 'block';

        importBookmark.className = "";

        addBookmark.className = "";
        addBookmark.className = "is-active";
    }

  addBookmark2.onclick = function() {
    importBookmarkForm.style.display = 'none';
    addBookmarkForm.style.display = 'block';
    addBookmarkForm1.style.display = 'block';
    addBookmarkForm2.style.display = 'block';

    importBookmark.className = "";

    addBookmark.className = "";
    addBookmark.className = "is-active";
  }

    /**************************************************************************/
    function addBookmarkHTML(bookmarks) {
        var bookmark_list = '';
        for(var i = 0; i < bookmarks.length; i++) {
            bookmark_list += 
            '<div class="col-1-3 mobile-col-1-3 card-min-width">\n' +
            '    <div class="content">\n' +
            '        <div class="card card--small" id="bookmark-card-' + bookmarks[i].id + '">\n' +
            '            <div style="background-color:#DE2924" class="card__image"></div>\n' +
            '            <a class="bookmark-link" id="bookmark-url-' + bookmarks[i].id +'" href="' + bookmarks[i].url + '"><h2 id="title-bookmark-' + bookmarks[i].id + '" class="card__title">' + bookmarks[i].title + '</h2></a>\n' +
            '            <div class="card__action-bar">\n';
            if(typeof bookmarks[i].star !== 'undefined' && bookmarks[i].star == 1) {
                bookmark_list += '                <a class="card__button" href="/bookmarks/' + bookmarks[i].id + '/unstar" id="star-bookmark-' + bookmarks[i].id +'"><i class="fa fa-star fa-lg"></i></a>\n';
            } else {
                bookmark_list += '                <a class="card__button" href="/bookmarks/' + bookmarks[i].id + '/star" id="star-bookmark-' + bookmarks[i].id +'"><i class="fa fa-star fa-lg fa-star-inactive"></i></a>\n';
            }
            bookmark_list +=
            '                <a class="card__button" href="#editBookmark" id="edit-bookmark-' + bookmarks[i].id + '"><i class="fa fa-info-circle fa-lg"></i></a>\n' +
            '                <a class="card__button" href="/bookmarks/delete/' + bookmarks[i].id + '" id="delete-bookmark-' + bookmarks[i].id + '"><i class="fa fa-trash-o fa-lg"></i></a>\n' +
            '            </div>\n' +
            '         </div>\n' +
            '     </div>\n' +
            '</div>\n';
        }
        return bookmark_list;
    }

    // error modal
    function showErrorModal(header,message)
    {
        window.location.hash = 'warningModal';
        $("#warningTitle:first").text(header);
        $("#warningMessage").text(message);
    }

    function setMaxHeightFolders()
    {
        $('#folderList').css('height', '100%');
        var height = $('#folderList').height() - $('#sidebar div:first').height();
        $('#folderList').css('max-height', height+'px');
    }

    // $( window ).resize(function() {
    //   setMaxHeightFolders();
    // });

}
