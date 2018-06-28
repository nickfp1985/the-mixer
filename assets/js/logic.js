$(document).ready(function () {


    $('#searchDrink').on('click', function (event) {

        event.preventDefault();

        //CLEAR PREVIOUS RESULTS ON INDEX.HTML:
        $('.results').empty();

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
                let $target = $('.results');

                let $imgThumbDiv = $(`<div>`)
                    .css({ "width": "200px", "display": "inline-block", "margin": "20px" });


                let $img = $(`<img src="${res.drinks[i].strDrinkThumb}" id="${res.drinks[i].idDrink}" >`)
                    .css({ "width": "200px", "border-radius": "10px" });
                let $name = $(`<h4>${res.drinks[i].strDrink}</h4>`)
                    .css({ "text-align": "center" });

                //APPLYING CLICK LISTENER TO EACH 'THUMBNAIL RESULT' - ON CLICK THE DIV WILL NEED TO:
                //  - CLEAR OUT RESULTS PANEL
                //  - CREATE A NEW .AJAX REQUEST USING THE "FIND BY ID" API FEATURE
                //  - UPDATE PAGE WITH FINAL RESULTS
                //  - UPDATED PAGE WILL NEED A "GO BACK" OR "NEW SEARCH" BUTTON
                $img.on('click', function () {

                    console.log($(this).attr('id'));
                    /* https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13060 : EXAMPLE URL FOR ID SEARCH */

                    let findByIdBaseURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
                    let drinkID = $(this).attr('id');
                    let fullQueryURLByID = findByIdBaseURL + drinkID;
                    fullQueryURLByID.toString().trim();

                    $.ajax({
                        url: fullQueryURLByID,
                        method: "GET"
                    }).then(function (res) {

                        let drinkObj = res.drinks[0];
                        //HERE ARE THE RESULTS WE WILL USE TO GENERATE NEW PAGE WITH COMPLETE DRINK INFORMATION INCLUDING INREDIENTS, AMOUNTS, HOW TO INSTRUCTIONS ETC.
                        console.log(drinkObj);

                        console.log(Object.keys(drinkObj));

                        //CREATE AN ARRAY FROM OBJECT ENTRIES
                        let drinkArray = Object.entries(drinkObj);
                        console.log(drinkArray[9][0]);
                        console.log(drinkArray[9][1]);
                        //USE .MAP or .FILTER METHODS TO STORE INGREDIENTS INTO AN ARRAY -- should equal same length
                        
                        //USE .MAP or .FILTER METHODS TO STORE MEASUREMENTS INTO AN ARRAY -- should equal same length
                    });

                });

                $imgThumbDiv.append($img);
                $imgThumbDiv.append($name);

                $target.append($imgThumbDiv);
            }
        })

    }) /*end of submit click listener*/

    
}) /*END DOC.READY()*/
