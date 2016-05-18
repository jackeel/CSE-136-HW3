window.onload = function() {

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
var insertupdateErrors = document.getElementById("insertupdate-errors");
var insertupdateErrors1 = document.getElementById("insertupdate-errors1");

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

importBookmark.onclick = function() {
	addBookmarkForm.style.display = 'none';
	addBookmarkForm1.style.display = 'none';
	importBookmarkForm.style.display = 'block';

	addBookmark.className = "";

	importBookmark.className = "";
	importBookmark.className = "is-active";
}
}
