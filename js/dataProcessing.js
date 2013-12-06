function writediv(texte) {
	document.getElementById('pseudobox').innerHTML = texte;
}

function getObjets(question) {
		alert('dataProcessing.php?pseudo='+escape(question));
		writediv(file('dataProcessing.php?pseudo='+escape(question)));
}
function file(fichier) {
	if(window.XMLHttpRequest) // FIREFOX
		xhr_object = new XMLHttpRequest();
	else if(window.ActiveXObject) // IE
		xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
	else
		return(false);
	xhr_object.open("GET", fichier, false);
	xhr_object.send(null);
	if(xhr_object.readyState == 4) return(xhr_object.responseText);
	else return(false);
}

function parseAnswer(txt) {
	
}
