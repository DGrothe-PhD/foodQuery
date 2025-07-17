var EAN = 4056489009207;
$('#EAN').change(function() { window.EAN = this.value;});

function tryAddImage(jsonObject){
  selectedLang = document.getElementById("language").value;
  let imageLocale = selectedLang.slice(0,2).toLowerCase();
  const args = Array.prototype.slice.call(arguments, 1);
  let queryHook = jsonObject;
  if(args.length<2){
    $('#product_images').append(`<span class="img-lost">Skriptfehler. `
     + `Syntax: tryAddImage(imageHook, "nutrition", "display").</span>`);
    return;
  }
  //
  if(!jsonObject[args[0]] || !jsonObject[args[0]][args[1]]){
    $('#product_images').append(`<span class="img-lost">Kein Bild von ${args[0]}. </span>`);
    return;
  }
  // try to retrieve locale image
  if(imageLocale != "de"){
    if(jsonObject[args[0]][args[1]][imageLocale]){
      $('#product_images').append(
        `<img style="width:25%" `
        + `src="${jsonObject[args[0]][args[1]][imageLocale]}" alt="Bild der Verpackung"/>`
      );
      return;
    }
  }
  // DE fallback routine
  if(!jsonObject[args[0]][args[1]]["de"]){
    $('#product_images').append(`<span class="img-lost">No image of ${args[0]}. </span>`);
    return;
  }
  
  $('#product_images').append(
    `<img class="product-img" style="width:25%;cursor:pointer;" `
    + `src="${jsonObject[args[0]][args[1]]["de"]}" alt="Bild der Verpackung"/>`
  );
  // Handler registrieren (falls mehrfach Bilder geladen werden, vorher alte entfernen)
  $('#product_images').off('click', '.product-img').on('click', '.product-img', function() {
    $('#lightbox-img').attr('src', $(this).attr('src'));
    $('#img-lightbox').fadeIn(150);
  });
  
  $('#lightbox-close, #img-lightbox').off('click').on('click', function(e){
    // Schließen nur, wenn nicht auf das Bild geklickt
    if(e.target === this || e.target.id === "lightbox-close") {
      $('#img-lightbox').fadeOut(150);
      $('#lightbox-img').attr('src', '');
    }
  });
}

const defaultProductTitle = {"de": "Ohne Namen", "en": "No Name", "fr": "Pas de nom"};
const nutriments = {"de": "Nährwerte", "en": "Nutriments", "fr": "Informations nutritionnelles"};
const ingredients = {"de": "Zutaten", "en": "Ingredients", "fr": "Ingrédients"};


function ignUndef(text){
  if(String(text).indexOf("undefined") >-1){
    return "";
  }
  return text;
}

async function getFoodInformation(){
  selectedLang = document.getElementById("language").value;
  window.EAN = document.getElementById("EAN").value;
  window.EAN = window.EAN.trim();
  let URL = `https://world.openfoodfacts.org/api/v3/product/${window.EAN}.json`;
  let foodJson = await loadJson(URL);
  
  // list of product information
  // fallback if article doesn't exist or no German name given
  let productTitle = `${defaultProductTitle[selectedLang]}`;
  let productHtml = "<ul>";
  let hook = null;
  let imageHook = null;
  try{
    hook = foodJson["product"];
    if($('#EAN').val() == 4056489009207){
      $("#imageTakenMyself").html(`<img src="./assets/4056489009207.jpg" alt="EAN 4056489009207" width="25%"/>`);
    }
    else{
      $("#imageTakenMyself").html(`&nbsp;`);
    }
    let productNameKey = `product_name_${selectedLang}`;
    productTitle = `${ignUndef(hook[productNameKey])}`;
    if(!productTitle){
      productTitle = `${ignUndef(hook["product_name_de"])}`;
    }
    productHtml += `<li>${ignUndef(hook["serving_size"])} ${ignUndef(hook["serving_quantity"])}</li>`;
    
    //Nutriments are language-independent.
    let nutri = `<details><summary>${nutriments[selectedLang]}</summary><p class = "nutriments">`;
    for(let x in hook["nutriments"]){
      nutri += `${x}: ${hook["nutriments"][x]}<br>`;
    }
    nutri += "</p></details>";
    productHtml += nutri;
    
    //Ingredients
    let ingredientsKey = `ingredients_text_${selectedLang}`;
    ingredientsText = `${ignUndef(hook[ingredientsKey])}`;
    if(!ingredientsText){
      ingredientsText = `${ignUndef(hook["ingredients_text_de"])}`;
    }
    productHtml += `<li>${ingredients[selectedLang]}: ${ingredientsText}</li>`;
    imageHook = hook["selected_images"];
  }
  catch(error){
    //$('#information').html("<p>Could not retrieve information.</p>");
    if(error instanceof TypeError){
      productHtml += `<p>Article not found.</p>`;
    }
  }
  finally{
    $("#product_name").html(`<h3>${productTitle}</h3>`);
    productHtml += "</ul>";
    $("#information").html(productHtml);
  }
  
  // images from DE database
  $('#product_images').html("");

  try{
    // Front image
    tryAddImage(imageHook, "front", "display","de");

  // Ingredients
    tryAddImage(imageHook, "ingredients", "display","de");

  // Nutrition image
    tryAddImage(imageHook, "nutrition", "display","de");
  }
  catch(error){
    $('#product_images').append(`<span class="img-lost">Kein Foto.</span>`);
    if(error instanceof TypeError){
      $('#product_images').append(`<span class="img-lost">Article not found.</span>`);
    }
  }
}

function clearEANfield(){
  $('#EAN').val("");
}