var EAN = 4056489009207;
$('#EAN').change(function() { window.EAN = this.value;});

async function getFoodInformation(){
  window.EAN = document.getElementById("EAN").value;
  window.EAN = window.EAN.trim();
  let URL = `https://world.openfoodfacts.org/api/v3/product/${window.EAN}.json`;
  let foodJson = await loadJson(URL);
  
  // list of product information
  // fallback if article doesn't exist or no German name given
  let productTitle = "<h3><em>Ohne Namen</em></h3>";
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
    productTitle = `<h3>${hook["product_name_de"]}</h3>`;
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
    $("#product_name").html(productTitle);
    productHtml += "</ul>";
    $("#information").html(productHtml);
  }
  
  // images from DE database
  $('#product_images').html("");

  // Front image
  try{
    $('#product_images').append(`<img style="width:25%" `
    + `src="${imageHook["front"]["display"]["de"]}" alt="Bild der Verpackung"/>`);
  }
  catch(error){
    $('#product_images').append(`<span class="img-lost">Foto der Vorderseite fehlt.</span>`);
  }
  // Ingredients
  try{
    $('#product_images').append(`<img style="width:25%" `
    + `src="${imageHook["ingredients"]["display"]["de"]}" alt="Bild der Verpackung"/>`);
  }
  catch(error){
    $('#product_images').append(`<span class="img-lost">Foto der Zutatenliste fehlt.</span>`);
  }
  // Nutrition image
  try{
    $('#product_images').append(`<img style="width:25%" `
    + `src="${imageHook["nutrition"]["display"]["de"]}" alt="Bild der Verpackung"/>`);
  }
  catch(error){
    $('#product_images').append(`<span class="img-lost">Kein Foto einer Nährwerttabelle.</span>`);
  }
}