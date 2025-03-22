// Sandbox for collecting images without raising exceptions.
function tryAddImage(jsonObject){
  try{
    const args = Array.prototype.slice.call(argument, 1);
    let queryHook = jsonObject;
    for (key in args){
      queryHook = queryhook[key];
    }
    console.log(queryhook);
    console.log("happy path");
    $('#product_images').append(
      `<img style="width:25%" `
      + `src="${jsonObject}" alt="Bild der Verpackung"/>`
    );
  }
  catch(error){
    $('#product_images').append(`<span>Kein Bild vorhanden. </span>`);
  }
}

var EAN = 4056489009207;
$('#EAN').change(function() { window.EAN = this.value;});

async function getFoodInformation(){
  window.EAN = document.getElementById("EAN").value;
  let URL = `https://world.openfoodfacts.org/api/v3/product/${window.EAN}.json`;
  let foodJson = await loadJson(URL);
  
  // list of product information
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
    $("#product_name").html(`<h3>${hook["product_name_de"]}</h3>` );
    productHtml += `<li>${hook["serving_size"]} ${hook["serving_quantity"]}</li>`;
    let nutri = `<details><summary>Nährwerte:</summary><p class = "nutriments">`;
    for(let x in hook["nutriments"]){
      nutri += `${x}: ${hook["nutriments"][x]}<br>`;
    }
    nutri += "</p></details>";
    productHtml += nutri;
    productHtml += `<li>${hook["ingredients_text_de"]}</li>`;
    imageHook = hook["selected_images"];
  }
  catch(error){
    $('#information').html("<p>Could not retrieve information.</p>");
  }
  finally{
    productHtml += "</ul>";
    $("#information").html(productHtml);
  }
  
  // images from DE database
  try{
    $('#product_images').html("");
    tryAddImage(imageHook["front"]["displa88y"]["de"]);
    /*$('#product_images').html(`<img style="width:25%" `
      + `src="${}" alt="Bild der Verpackung"/>`
      + `<img style="width:25%" `
      + `src="${imageHook["ingredients"]["display"]["de"]}" alt="Bild der Verpackung"/>`
      + `<img style="width:25%" `
      + `src="${imageHook["nutrition"]["display"]["de"]}" alt="Bild der Verpackung"/>`*/
    //);
  }
  catch(error){
    $('#product_images').html("<p>Keine Bilder.</p>");
  }
}