window.onload = function() {
    /*************************** AJAX **********************************/
   //Change Password
	 $("#resetPassword").on("submit", function (event) {
		 event.preventDefault();
		 window.location.hash = "";
		 var url = '/passwordReset';
		 var params = JSON.stringify({
			 "password" : document.getElementById("password").value,
			 "confirm_password" : document.getElementById("confirm_password").value
		 });
		 console.log(params);
		 $.ajax({
			 cache: false,
			 type: 'POST',
			 url: url,
			 contentType: 'application/json',
			 dataType: 'json',
			 data: params,
			 success: function(result) {
			 },
			 error: function(xhr, status, error) {
        }
         });
     });


    // Create new bookmark
    /*
    $("#addBookmarkForm").on("submit", function(event) {
    	event.preventDefault();

        var url = $("#addBookmarkForm").attr("action");
        var params = new Array();
        var form_elements = document.getElementById("addBookmarkForm").elements;
        for(var i = 0; i < form_elements.length; i ++){
            params.push(form_elements[i].name + '=' + form_elements[i].value.trim());
        }
        params = params.join('&')

        $.ajax({
        	cache: false,
        	type: 'POST',
        	url: url,
        	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        	dataType: 'json',
        	data: params,
        	success: function(result) {
                // TODO: append to correct folder only
        		$('#right-content').append(
        	        '<div class="col-1-3 mobile-col-1-3 card-min-width">\n' +
                	'    <div class="content">\n' +
					'        <div class="card card--small">\n' +
					'	         <div style="background-color:#DE2924" class="card__image"></div>\n' +
					'	         <a href="' + result.url + '"><h2 class="card__title">' + result.title + '</h2></a>\n' +
					'		     <div class="card__action-bar">\n' +
  					'			     <a class="card__button" href="/bookmarks/' + result.bookmark_id + '/star" id="star-bookmark-' + result.bookmark_id +'"><i class="fa fa-star fa-lg fa-star-inactive"></i></a>\n' +
					'		         <a class="card__button" href="/bookmarks/edit/' + result.bookmark_id + '" id="edit-bookmark-' + result.bookmark_id +'"><i class="fa fa-info-circle fa-lg"></i></a>\n' +
					'		         <a class="card__button" href="/bookmarks/delete/' + result.bookmark_id + '" id="delete-bookmark-' + result.bookmark_id +'"><i class="fa fa-trash-o fa-lg"></i></a>\n' +
					'	         </div>\n' +
					'         </div>\n' +
				    '     </div>'
				);
        	},
        	error: function(xhr, status, error) {
        	}
        });

        return false;
    });

    // Star/unstar bookmark
    $("#right-content").on("click", ".card__action-bar a:nth-of-type(1)", function(event) {
        event.preventDefault();

        var url = $(this).attr("href");
        var params = {"bookmark_id" : $(this).attr("id").split("-")[2]};

        $.ajax({
        	type: 'GET',
        	url: url,
        	dataType: 'json',
        	data: params,
        	success: function(result) {
        		// Style the star and change its link
        		var star = $("#star-bookmark-" + result.bookmark_id);
        		var child_i = $("#star-bookmark-" + result.bookmark_id + " > i");

        		child_i.toggleClass("fa-star-inactive");

                if(child_i.hasClass("fa-star-inactive")) {
        		    star.attr("href", "/bookmarks/" + result.bookmark_id + "/star");
        	    } else {
                    star.attr("href", "/bookmarks/" + result.bookmark_id + "/unstar");
        	    }
        	},
        	error: function(xhr, status, error) {
        	}
        });
    });

    // Delete bookmark
    $("#right-content").on("click", ".card__action-bar a:nth-of-type(3)", function(event) {
        event.preventDefault();

        var url = $(this).attr("href");
        var params = {"bookmark_id" : $(this).attr("id").split("-")[2]};

        $.ajax({
        	type: 'GET',
        	url: url,
        	dataType: 'json',
        	data: params,
        	success: function(result) {
        		// Remove bookmark from list
        		$("#star-bookmark-" + result.bookmark_id).closest("div.col-1-3.mobile-col-1-3.card-min-width").remove();
        	},
        	error: function(xhr, status, error) {
        	}
        });
    });

    // Create new folder
    $("#addFolderForm").on("submit", function(event) {
    	event.preventDefault();

        var url = $("#addFolderForm").attr("action");
        console.log(url);
        var params = new Array();
        var form_elements = document.getElementById("addFolderForm").elements;
        for(var i = 0; i < form_elements.length; i ++){
            params.push(form_elements[i].name + '=' + form_elements[i].value.trim());
        }
        params = params.join('&')

        $.ajax({
        	cache: false,
        	type: 'POST',
        	url: url,
        	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        	dataType: 'json',
        	data: params,
        	success: function(result) {
        		// Append folder to sidebar
        		$('#folderList').append(
	            	'<li><a href="/list/' + result.folder_id + '">' + result.folder_name + '</a>\n' +
	                '    <a class="pad-trash-icon" href="/folders/delete/' + result.folder_id + '" id="delete-folder-' + result.folder_id + '"><i class="fa fa-trash-o fa-lg"></i></a>\n' +
	                '</li>'
				);

                // Add folder into the addBookmark modal
                $('.ListFieldWrapper > select').append(
                    '<option value="' + result.folder_id + '">' + result.folder_name + '</option>'
                );
        	},
        	error: function(xhr, status, error) {
        	}
        });

        return false;
    });

    // Delete folder
    $("#folderList").on("click", ".pad-trash-icon", function(event) {
        event.preventDefault();

        var url = $(this).attr("href");
        var params = {"folder_id" : $(this).attr("id").split("-")[2]};

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            data: params,
            success: function(result) {
                // Remove folder from side list
                $("#delete-folder-" + result.folder_id).closest("li").remove();

                // TODO: Remove necessary bookmarks from the list

                // Remove folder from the addBookmark modal
                $('.ListFieldWrapper option[value=' + result.folder_id + ']').remove();
            },
            error: function(xhr, status, error) {
            }
        });
    });

    // Select folder / keyword search / sort option
    // TODO: add listener for keyword search / sort option
    $("#folderList").on("click", "li a:nth-of-type(1)", function(event) {
        event.preventDefault();

        var url = $(this).attr("href");
        var params = {"folder_id": "", "SortBy": "", "Search": ""};

        // TODO: grab selected bookmarks from listBookmarks and replace the innerHTML of $("#bookmarks")

//From bookmarks.js
//var folder_id = req.params.folder_id;
//var order_by = req.query['SortBy'] ? req.query['SortBy'] : 'bookmarks.id';
//var search = req.query['Search'] ? req.query['Search'] : '';
    });
*/

	$("#right-content").on("click", ".card__action-bar a:nth-of-type(2)", function(event) {
			//event.preventDefault();
			debugger;
	    var bookmark_id = $(this).attr("id").split("-")[2];
			var title = $(this).attr("id").split("-")[3]; //get the title from the bookmark
			var url = $(this).attr("id").split("-")[4]; //get the url from the bookmark
      console.log(title);
	    // open the modal with above fields appended into the value

			var actionurl = $('#editForm').attr('action');
			$('#editForm')[0].setAttribute('action', actionurl + bookmark_id);
	    $('#editForm input[name="title"]').val(title);
			$('#editForm input[name="url"]').val(url);
		//	$('input[name="folder_id"]').val()="<%= %>";

		//	$("editForm") ... stuff
			// append stuff to the editmodal

		/*  $("#editForm").on("submit", function(event) {
				$.ajax({
					type: 'GET',
					url: url,
					dataType: 'json',
					data: params,
					success: function(result) {
						// Remove bookmark from list
					},
					error: function(xhr, status, error) {
					}
				});

			});
			*/
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
	var importBookmark = document.getElementById("import-bookmark");
	var addBookmarkForm = document.getElementById("add-bookmark-form");
	var addBookmarkForm1 = document.getElementById("add-bookmark-form1");
	var importBookmarkForm = document.getElementById("import-bookmark-form");

	addBookmark.onclick = function() {
		console.log(addBookmark);
		importBookmarkForm.style.display = 'none';
		addBookmarkForm.style.display = 'block';
		addBookmarkForm1.style.display = 'block';

		importBookmark.className = "";

		addBookmark.className = "";
		addBookmark.className = "is-active";

	}

	addBookmark1.onclick = function() {
		console.log(addBookmark);
		importBookmarkForm.style.display = 'none';
		addBookmarkForm.style.display = 'block';
		addBookmarkForm1.style.display = 'block';

		importBookmark.className = "";

		addBookmark.className = "";
		addBookmark.className = "is-active";
	}
	/**************************************************************************/
}
