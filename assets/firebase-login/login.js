$(document).ready(function() {

  const database = firebase.database();
  const ref = database.ref();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // USER IS SIGNED IN -> hide the login div and show logout
      document.getElementById("login-id").style.display = "none";
      document.getElementById("logout-id").style.display = "block";

      let user = firebase.auth().currentUser;
      if(user != null){
        let userEmail = user.email;
        $('#login-msg').text("You have logged in as: " + userEmail);
      }
    } else {
      // NO USER SIGNED IN -> hide the logout div and show login
      document.getElementById("login-id").style.display = "block";
      document.getElementById("logout-id").style.display = "none";
    }
  });

  // BUTTON CLICK -> to authenticate user input against firebase db
  $('.login-btn').on('click',function(event){
    event.preventDefault();

    // get user input email and password
    let userEmail = $('#user-email').val().trim();
    let userPw = $('#user-pw').val().trim();
    console.log("login button is working!");
    console.log(userEmail + " " + userPw);

    firebase.auth().signInWithEmailAndPassword(userEmail, userPw).catch(function(error) {
      // handle login errors here
      let errorCode = error.code;
      let errorMessage = error.message;
      
      console.log("Error : " + errorMessage);
    });

  })

  $('.logout-btn').on('click',function(event){
    event.preventDefault();

    firebase.auth().signOut(); //.then(function() {
      // logout successful
    //}).catch(function(error) {
      // an error happened during logout
    //});

  })

})
