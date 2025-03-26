let language = navigator.language;
      async function loadJson(file) {
        let text = "";
        const response = await fetch(file);
        if (!response.ok){text = "";} else {text = response.json();}
        return text;
}
function switchLanguage(event) {
  event.preventDefault();
  const selectedLang = document.getElementById("language").value;
  const links = document.querySelectorAll('link[rel="alternate"]');

  for (let link of links) {
    if (link.getAttribute("hreflang") === selectedLang) {
      window.location.href = link.getAttribute("href");
      return;
    }
  }

  //alert("Die gewünschte Sprache ist nicht verfügbar.");
}