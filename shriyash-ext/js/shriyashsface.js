chrome.runtime.sendMessage("config", function(response) {
	var els = document.getElementsByClassName("_48pw");
	Array.prototype.forEach.call(els, function(x, i, a) {
		x.style.backgroundImage="url(" + chrome.extension.getURL("images/shriyash.png") + ")";
		x.style.backgroundPosition="0px 0px";
		x.style.backgroundSize="cover";
	});
});
