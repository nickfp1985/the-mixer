$(document).ready(function () {

    /*NIGEL CODE:*/

    randomDrink();
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

                // set variables for final html page 
                let drinkName = response.drinks[0];
                let div = $('<div>');
                let imgSrc = drinkName.strDrinkThumb;

                let img = $(`<img src="${imgSrc}" id="${drinkName.idDrink}">`);
                img.addClass('drinks').css({ "height": "250px", "width": "250px", "border-radius": "10px", "margin": "10px" });
                let name = $('<p>');
                name.text(drinkName.strDrink);
                name.addClass('name').css({ "text-align": "center" });

                //COPY AND PASTE INDIVIDUAL .AJAX REQUEST CODE HERE:
               
                //  END INDIVIDUAL .AJAX REQUESET CODE    */

                // append info to page 
                div.append(img);
                div.append(name);
                $('.random-four').append(div);
            })

        }
    }

    /*COMMENTED THIS CLICK LISTENER OUT FOR NOW:

    $(document).on('click', '.drinks', function () {
        console.log($(this));
        let drinkID = $(this).attr('id');
        console.log(drinkID);
    })

    /*END NIGEL CODE:*/

    $('#searchName').on('click', function (event) {

        event.preventDefault();

        $('.container-results').show();
        $('.landing-page').hide();
        //CLEAR PREVIOUS RESULTS ON INDEX.HTML:
        // $('.container-results').empty();

        //DEVELOPING QUERY URL STRING FROM DRINK-NAME INPUT:
        let $drinkName = $('#inputDrinkName').val().trim();
        let baseURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
        let queryURL = baseURL + $drinkName;
        queryURL.toString().trim();

        console.log(queryURL);

        //FIRST .AJAX REQUEST:
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (res) {
            console.log(res);

            //RESPONSE IS USUALLY AN ARRAY, SET UP A FOR LOOP WITH ARRAY.LENGTH:
            let resultsLength = res.drinks.length;
            console.log(resultsLength);

            //USING JQUERY TO CREATE DIVS OR 'THUMBNAIL RESULTS' ON SCREEN CONTAINING DRINK IMAGE + DRINK NAME:
            //  (!)should probably substitute forEach or filter array methods here(!)
            for (let i = 0; i < resultsLength; i++) {
                let $target = $('.container-results');

                let $img = $(`<img src="${res.drinks[i].strDrinkThumb}" id="${res.drinks[i].idDrink}" >`)
                            .addClass('img-fluid')
                            .addClass('drinkThumb1');

                //APPLYING CLICK LISTENER TO EACH 'THUMBNAIL RESULT' - ON CLICK THE DIV WILL NEED TO:
                //PASSING .AJAX CALL TO EACH RESULTS IMAGE ON CLICK:
                $img.on('click', function () {

                    console.log($(this).attr('id'));
                    /* https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13060 : EXAMPLE URL FOR ID SEARCH */
                    $('.drinkThumb1').hide();
                    $('.final-drink').show();
                    let findByIdBaseURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
                    let drinkID = $(this).attr('id');
                    let fullQueryURLByID = findByIdBaseURL + drinkID;
                    fullQueryURLByID.toString().trim();

                    $.ajax({
                        url: fullQueryURLByID,
                        method: "GET"
                    }).then(function (res) {

                        //HERE ARE THE RESULTS WE WILL USE TO GENERATE NEW PAGE WITH COMPLETE DRINK INFORMATION INCLUDING INREDIENTS, AMOUNTS, HOW TO INSTRUCTIONS ETC.
                        let data = res.drinks[0];
                        console.log(data);
                        console.log(Object.keys(data));
                        
                        let drinkObj = {}

                        drinkObj.imgSrc = data.strDrinkThumb;
                        drinkObj.name = data.strDrink;
                        drinkObj.withAlcohol = data.strAlcoholic;
                        drinkObj.glassType = data.strGlass;
                        drinkObj.ingredients = [];
                        drinkObj.amounts = [];
                        
                        //PULLING INGREDIENTS INTO ARRAY:
                        //CREATE AN ARRAY FROM OBJECT ENTRIES
                        let drinkInfoArray = Object.entries(data);
                        //CREATE AN ARRAY OF ONLY INGREDIENT PAIRS:
                        let drinkIngredients = [];
                        for (let i = 9; i < 24; i++) {
                            drinkIngredients.push(drinkInfoArray[i]);
                        }
                        //CREATE FINAL ARRAY OF INGREDIENTS:
                        for (let i = 0; i < drinkIngredients.length; i++) {
                            let individualIngredient = drinkIngredients[i][1];    
                            if (individualIngredient === "") {
                            } else if (individualIngredient) {
                                drinkObj.ingredients.push(individualIngredient);
                            }
                        }
                        console.log("INGREDIENTS");
                        console.log(drinkObj.ingredients);

                        let amountsInfoArray = Object.entries(data);
                        let drinkAmounts = [];
                        for (let i = 24; i < 39; i++){
                            drinkAmounts.push(amountsInfoArray[i]);
                        }
                        //CREATE FINAL ARRAY OF AMOUNTS:
                        for (let i = 0; i < drinkAmounts.length; i++){
                            let individualAmount = drinkAmounts[i][1];
                            if (individualAmount === " ") {
                            } else if (individualAmount) {
                                drinkObj.amounts.push(individualAmount);
                            }
                        }

                        $('.list').empty();

                        $('.drink-name').text(`${drinkObj.name}`);
                        $('.drink-alcoholic').text(`${drinkObj.withAlcohol}`);
                        $('.drinkThumb2').attr('src', `${drinkObj.imgSrc}`);
                        $('.drink-glass').text(`${drinkObj.glassType}`);

                        for(let i = 0; i < drinkObj.ingredients.length; i++) {

                            let $row = $('<tr>').addClass(`item:${i}`);
    
                            let $ingredient = $(`<td class="ingredient border-right">${drinkObj.ingredients[i]}</td>`);
                            let $amount = $(`<td class="measure">${drinkObj.amounts[i]}</td>`);
    
                            $row.append($ingredient);
                            $row.append($amount);
    
                            $('.list').append($row);

                        }
                        

                    });

                }); /*end image click listener*/
                            
                let $name = $(`<h4>${res.drinks[i].strDrink}</h4>`)
                            .css({ "text-align": "center" });
                
                $img.append($name);
                $target.append($img);

            }
        })

    }) /*end of submit click listener*/


}) /*END DOC.READY()*/
