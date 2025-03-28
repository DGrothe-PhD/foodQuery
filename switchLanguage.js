let defaultLanguage = navigator.language;
let selectedLang = navigator.language;

async function loadJson(file){
  let text="";
  const response = await fetch(file);
  if(!response.ok){text="";}else{text=response.json();}
  return text;
}

function setDefaultLanguage(){
  try{
    const links = document.querySelectorAll('link[rel="alternate"]');
    let fallBackLink = null;
    for (let link of links) {
      if (link.getAttribute("hreflang") === defaultLanguage) {
        window.location.href = link.getAttribute("href");
        selectedLang = defaultLanguage;
        return;
      }
      // Fallback for any language this coder doesn't speak.
      if (link.getAttribute("hreflang").slice(0,2).toLowerCase() === "en"){
        fallBackLink = link;
      }
    }
    if(fallBackLink != null){
      window.location.href = fallBackLink.getAttribute("href");
      selectedLang = "en";
    }
  }
  catch(error){
    alert("oops");
  }
}

function switchLanguage(event) {
  event.preventDefault();
  selectedLang = document.getElementById("language").value;
  const links = document.querySelectorAll('link[rel="alternate"]');

  for (let link of links) {
    if (link.getAttribute("hreflang") === selectedLang) {
      window.location.href = link.getAttribute("href");
      return;
    }
  }
}