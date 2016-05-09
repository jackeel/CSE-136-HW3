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
var importBookmark = document.getElementById("import-bookmark");
var addBookmarkForm = document.getElementById("add-bookmark-form");
var importBookmarkForm = document.getElementById("import-bookmark-form");


addBookmark.onclick = function() {
	importBookmarkForm.style.display = 'none';
	addBookmarkForm.style.display = 'block';

	importBookmark.className = "";

	addBookmark.className = "";
	addBookmark.className = "is-active";

}

importBookmark.onclick = function() {
	addBookmarkForm.style.display = 'none';
	importBookmarkForm.style.display = 'block';

	addBookmark.className = "";

	importBookmark.className = "";
	importBookmark.className = "is-active";
}
}