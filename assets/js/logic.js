$(document).ready(function() {
  const database = firebase.database();
  const ref = database.ref();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // USER IS SIGNED IN -> hide the login div and show logout
      document.getElementById('login-id').style.display = 'none';
      document.getElementById('logout-id').style.display = 'block';

      let user = firebase.auth().currentUser;
      if (user != null) {
        let userEmail = user.email;
        $('#login-msg').text('You are logged in as: ' + userEmail);
        document.getElementsByClassName('landing-page')[0].style.display =
          'initial';
      }
    } else {
      // NO USER SIGNED IN -> hide the logout div and show login
      document.getElementById('login-id').style.display = 'block';
      document.getElementById('logout-id').style.display = 'none';
    }
  });

  // BUTTON CLICK -> to authenticate user input against firebase db
  $('.login-btn').on('click', function(event) {
    event.preventDefault();

    // get user input email and password
    let userEmail = $('#user-email')
      .val()
      .trim();
    let userPw = $('#user-pw')
      .val()
      .trim();
    console.log('user has logged into account!');
    console.log(userEmail + ' ' + userPw);

    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPw)
      .catch(function(error) {
        // handle login errors here
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log('Error : ' + errorMessage);
        document.getElementsByClassName('alert')[0].style.display = 'initial';
      });
  });

  $('.logout-btn').on('click', function(event) {
    event.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(function() {
        // logout successful
        document.getElementsByClassName('landing-page')[0].style.display =
          'none';
        $('.container-results').empty();
        $('.final-drink').empty();
      })
      .catch(function(error) {
        // an error happened during logout
      });
  });
  //*******************//
  //RENDER FOUR RANDOM DRINKS ON PAGE LOAD:
  randomDrink(4);

  //***CLICK-EVENTS***//
  //*******************//

  //EVERY DRINK-IMAGE-THUMBNAIL WILL RENDER FINAL RESULTS PAGE ON 'CLICK':
  $(document).on('click', '.results-img', function() {
    //DOUBLE-CHECK ID IS PRESENT ON IMAGE:
    console.log($(this).attr('id'));
    /* THIS ID WILL GENERATE UNIQUE QUERY */

    $('.container-results').empty();
    $('.container-results').hide();
    $('.final-drink').show();

    //UNLIKE OTHER API REQUESTS, THIS ONE TARGETS UNIQUE DRINK ID:
    let findByIdBaseURL =
      'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
    let drinkID = $(this).attr('id');
    let fullQueryURLByID = findByIdBaseURL + drinkID;
    fullQueryURLByID.toString().trim();

    ajaxRequestByID(fullQueryURLByID);
  });

  //NEW-SEARCH BTN WILL RENDER LANDING PAGE AND NEW-SEARCH-FORM ON 'CLICK':
  $(document).on('click', '#newSearch', function(event) {
    event.preventDefault();
    //HIDE OR SHOW DIVS APPROPRIATELY:
    $('.landing-page').show();
    $('.container-results').empty();
    $('.random-four').empty();
    $('.final-drink').hide();
    randomDrink(4);

    //CLEAR PREVIOUS SEARCH INPUTS
    $('#inputDrinkName').val('');
    $('#inputAlcohol').val('');
  });

  //SEARCH BY DRINK NAME:
  $('#searchName').on('click', function(event) {
    event.preventDefault();
    //HIDE OR SHOW DIVS APPROPRIATELY:
    $('.landing-page').hide();
    $('.container-results').empty();
    $('.container-results').show();
    $('.new-search-container').show();

    //DEVELOPING QUERY URL STRING FROM DRINK-NAME INPUT:
    let $drinkName = $('#inputDrinkName')
      .val()
      .trim();
    let baseURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    let queryURL = baseURL + $drinkName;
    queryURL.toString().trim();

    ajaxRequest(queryURL);
  });

  //SEARCH BY INGREDIENT OR TYPE OF ALCOHOL:
  $('#searchAlcohol').on('click', function(event) {
    event.preventDefault();
    //HIDE OR SHOW DIVS APPROPRIATELY:
    $('.landing-page').hide();
    $('.container-results').empty();
    $('.container-results').show();
    $('.new-search-container').show();

    let $alcoholName = $('#inputAlcohol')
      .val()
      .trim();
    let baseURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
    let queryURL = baseURL + $alcoholName;
    queryURL.toString().trim();

    ajaxRequest(queryURL);
  });

  //SEARCH BY TYPE OF GLASS:
  $('#searchGlass').on('click', function(event) {
    event.preventDefault();
    //HIDE OR SHOW DIVS APPROPRIATELY:
    $('.landing-page').hide();
    $('.container-results').empty();
    $('.container-results').show();
    $('.new-search-container').show();

    //DEVELOPING QUERY URL STRING FROM DRINK-NAME INPUT:
    let $glassType = $('#glassType')
      .val()
      .trim();
    let baseURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=';
    let queryURL = baseURL + $glassType;
    queryURL.toString().trim();

    ajaxRequest(queryURL);
  });

  //***FUNCTIONS:***//
  //****************//

  //RENDER RANDOM DRINK THUMBNAILS (CLICKABLE) ON EVERY PAGE LOAD: (NUMBER OF THUMBNAILS DICTATED BY 'NUM' PARAM)
  function randomDrink(num) {
    for (let i = 0; i < num; i++) {
      let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

      $.ajax({
        url: queryURL,
        method: 'get'
      }).then(function(response) {
        // SET VARIABLES FOR FINAL HTML PAGE:
        let drinkName = response.drinks[0];
        let div = $('<div>');
        let imgSrc = drinkName.strDrinkThumb;

        let img = $(
          `<img src="${imgSrc}" id="${
            drinkName.idDrink
          }" class="results-img img-fluid">`
        );
        img
          .css({
            flex: '1',
            'max-height': '250px',
            'max-width': '250px',
            'border-radius': '10px',
            margin: '10px'
          })
          .on('click', function() {
            $('.landing-page').hide();
            $('.container-results').empty();
            $('.container-results').show();
          });
        let name = $('<p>');

        name.text(drinkName.strDrink);
        name.addClass('name').css({ 'text-align': 'center' });

        // APPEND INFO TO PAGE:
        div.append(img);
        div.append(name);
        $('.random-four').append(div);
      });
    }
  }

  //AJAX GET REQUEST FUNCTION TO RENDER INTIAL SEARCH RESULTS:
  function ajaxRequest(uniqueURL) {
    //FIRST .AJAX REQUEST:
    $.ajax({
      url: uniqueURL,
      method: 'GET'
    }).then(function(res) {
      //LOG RESPONSE & ASSIGN REFERENCE VARIABLE:
      let drinkData = res.drinks;
      //LENGTH OF RESPONSE OBJECT FOR LOOPING:
      let resultsLength = res.drinks.length;
      //JQUERY TO CREATE 'THUMBNAIL RESULTS' ON SCREEN CONTAINING DRINK IMAGE + DRINK NAME:
      //  (!)should probably substitute forEach or filter array methods here(!)
      for (let i = 0; i < resultsLength; i++) {
        let $target = $('.container-results');
        let $imgAndNameContainer = $('<div class="drinkThumb1">');
        let $img = $(
          `<img src="${drinkData[i].strDrinkThumb}" id="${
            drinkData[i].idDrink
          }" class="results-img">`
        ).addClass('img-fluid');
        // CLICK LISTENER FOR EACH IMAGE IS PREDIFINED FOR ALL IMAGES WITH CLASS ( .results-img ) //
        let $name = $(`<h5>${drinkData[i].strDrink}</h5>`).css({
          'text-align': 'center',
          color: 'white',
          margin: '10px 0 10px 0'
        });

        $imgAndNameContainer.append($img);
        $imgAndNameContainer.append($name);

        $target.prepend($imgAndNameContainer);
      }
    });

    //RENDER A NEW SEARCH BUTTON BELOW DRINK RESULTS: (LEVERAGING BOOTSTRAP CSS)
    // ************************************************************************ //
    //CONTAINER:
    let $bootstrapContainer = $('<div class="container-fluid">').css(
      'width',
      '100%'
    );
    //OUTER ROW:
    let $bootstrapRow = $(
      '<div class="row d-flex flex-row justify-content-center">'
    ).css('margin-top', '50px');
    //COLUMN:
    let $bootstrapCol = $(
      '<div class="col-12 d-flex flex-row justify-content-center">'
    );
    //BUTTON:
    let $newSearchDynamic = $(
      '<input class="btn btn-outline-warning" id="newSearch" type="submit" value="New Search">'
    );

    //APPEND, APPEND, APPEND:
    $bootstrapCol.append($newSearchDynamic);
    $bootstrapRow.append($bootstrapCol);
    $bootstrapContainer.append($bootstrapRow);
    //APPEND TO CONTAINER DRINKS:
    $('.container-results').append($bootstrapContainer);
  }

  //AJAX GET REQUEST FUNCTION TO RENDER FINAL PAGE RESULTS PAGE BY UNIQUE DRINK ID:
  function ajaxRequestByID(queryByID) {
    $.ajax({
      url: queryByID,
      method: 'GET'
    }).then(function(res) {
      //THE API/QUERY RESPONSE OBJECT:
      let data = res.drinks[0];
      // *************************** //

      //CREATE A NEW OBJECT TO HOLD PERTINENT INFO:
      let drinkObj = {};
      //INDIVIDUAL VALUES EASILY PAIRED:
      drinkObj.imgSrc = data.strDrinkThumb;
      drinkObj.name = data.strDrink;
      drinkObj.withAlcohol = data.strAlcoholic;
      drinkObj.glassType = data.strGlass;
      drinkObj.instructions = data.strInstructions;
      //CREATE ARRAYS FROM OBJECT LIST: WE NEED TO PULL ONLY INGREDIENTS OR AMOUNTS WITH VALUES LISTED:
      //(THE RESPONSE OBJECT PROVIDES BLANK DATA UP TO 15 EACH)
      drinkObj.ingredients = [];
      drinkObj.amounts = [];

      //PULLING INGREDIENTS INTO ARRAY:
      //(CREATE AN ARRAY FROM OBJECT ENTRIES)
      let drinkInfoArray = Object.entries(data);
      console.log(data);
      //CREATE AN ARRAY OF ONLY INGREDIENT PAIRS: (LISTED IN RESULTS OBJECT ARRAY INDICES [9] - [24])
      let drinkIngredients = [];
      for (let i = 19; i <= 33; i++) {
        drinkIngredients.push(drinkInfoArray[i]);
      }
      //CREATE FINAL ARRAY OF INGREDIENTS:
      for (let i = 0; i < drinkIngredients.length; i++) {
        let individualIngredient = drinkIngredients[i][1];
        if (individualIngredient === '') {
        } else if (individualIngredient) {
          drinkObj.ingredients.push(individualIngredient);
        }
      }
      //PULLING AMOUNTS/MEASUREMENTS INTO ARRAY:
      //(CAN USE SAME OBJECT ENTRIES ARRAY AS ABOVE ^ drinkInfoArray[i])

      let drinkAmounts = [];
      for (let i = 34; i <= 48; i++) {
        drinkAmounts.push(drinkInfoArray[i]);
        console.log(drinkInfoArray);
      }
      //CREATE FINAL ARRAY OF AMOUNTS:
      for (let i = 0; i < drinkAmounts.length; i++) {
        let individualAmount = drinkAmounts[i][1];
        if (individualAmount === ' ') {
        } else if (individualAmount) {
          drinkObj.amounts.push(individualAmount);
        }
      }

      //RENDER FINAL DRINK PAGE:
      $('.drink-name').text(`${drinkObj.name}`);

      if (drinkObj.withAlcohol === null) {
        $('.drink-alcoholic').text('');
      } else if (drinkObj.withAlcohol) {
        $('.drink-alcoholic').text(`${drinkObj.withAlcohol}`);
      }

      $('.drinkThumb2').attr('src', `${drinkObj.imgSrc}`);
      $('.drink-glass').text(`${drinkObj.glassType}`);
      $('.instructions').html(`<p>${drinkObj.instructions}</p>`);
      $('.list').empty();

      //FOREACH() METHOD TO PLACE INGREDIENTS AND AMOUNTS INTO FINAL RESULTS TABLE:
      //DECLARING INCREMENTER FOR USE IN THE BELOW .forEach() IN ORDER TO SIMULTANEOUSLY ACCESS drinkObj.amounts[] ARRAY:
      let amountIndex = 0;

      drinkObj.ingredients.forEach(function(ing) {
        //CREATE A NEW ROW TO HOLD INGREDIENT (LEFT) AMOUNT (RIGHT):
        let $row = $('<tr class="ingredients-amounts-row">');

        let $ingredient = $(`<td class="ingredient border-right">${ing}</td>`);

        if (drinkObj.amounts[amountIndex] === undefined) {
          drinkObj.amounts[amountIndex] = '&nbsp;';
        }
        let $amount = $(
          `<td class="measure">${drinkObj.amounts[amountIndex]}</td>`
        );

        amountIndex++;

        $row.append($ingredient).append($amount);
        //APPEND ROWS TO FINAL RESULTS TABLE:
        $('.list').append($row);
      });
    }); /* END .THEN() */
  }
}); /*END DOC.READY()*/
