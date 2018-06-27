$(document).ready(function(){

// functions to create random picture images in the dom 
    function randomDrink1(){
        let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
        
            $.ajax({
                url: queryURL,
                method: 'get'
            }).then(function (response) {
                console.log(response.drinks[0]);
                console.log(response.drinks[0].strDrinkThumb);
                
                let imgSrc = response.drinks[0].strDrinkThumb;
                
                let img = $(`<img src="${imgSrc}">`);

                let imgID = $(`<div>`);
                imgID.text('Drink ID: ' + idDrink);
                imgID.addClass('ID');

                // ID text
                $('#results1').append(img);
                $('#results1').append(imgID);

                // 
        }
    )}
    randomDrink1();
// ======================================
    function randomDrink2(){
        let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
        
        $.ajax({
            url: queryURL,
            method: 'get'
        }).then(function (response) {

            console.log(response.drinks[0].strDrinkThumb);
        
            let imgSrc = response.drinks[0].strDrinkThumb;
            
            let img = $(`<img src="${imgSrc}">`);
            
            $('#results2').append(img);
        }
    )}
    randomDrink2();
// ======================================
    function randomDrink3(){
        let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
        
        $.ajax({
            url: queryURL,
            method: 'get'
        }).then(function (response) {

            console.log(response.drinks[0].strDrinkThumb);
        
            let imgSrc = response.drinks[0].strDrinkThumb;
            
            let img = $(`<img src="${imgSrc}">`);
            
            $('#results3').append(img)
        }
    )}
    randomDrink3();
// ======================================
    function randomDrink4(){
        let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
        
        $.ajax({
            url: queryURL,
            method: 'get'
        }).then(function (response) {

            console.log(response.drinks[0].strDrinkThumb);

            let imgSrc = response.drinks[0].strDrinkThumb;
            
            let img = $(`<img src="${imgSrc}">`);
            
            $('#results4').append(img)
        }
    )}
    randomDrink4();

    
});        
        