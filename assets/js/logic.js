$(document).ready(function () {

    // function to create random picture images in the dom 
    function randomDrink() {
        
        for (let i = 0; i < 4; i++) {

            let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

                $.ajax({
                    url: queryURL,
                    method: 'get'
                }).then(function (response) {
                    console.log(response.drinks[0]);
                    console.log(response.drinks[0].strDrinkThumb);
                
                    // variables 
                    let drinkName = response.drinks[0]; 
                    let div = $('<div>');
                    let imgSrc = drinkName.strDrinkThumb;
                    
                    let img = $(`<img src="${imgSrc}" id="${drinkName.idDrink}">`);
                    img.addClass('drinks').css({ "height": "250px", "width": "250px", "border-radius": "10px", "margin": "10px" });
                    let name = $('<p>');
                    name.text(drinkName.strDrink);
                    name.addClass('name').css({ "text-align": "center" });
                    
                    // append info to page 
                    div.append(img);
                    div.append(name);
                    $('.random-four').append(div);
                    
                })
                
        }
    }
    randomDrink();

    $(document).on('click', '.drinks', function(){
        console.log($(this));
        let drinkID = $(this).attr('id');
        console.log(drinkID);
    })

    

});
