// this will house the array of movies
var movielist;

function getStorage() {

  $("#movie-list").empty(); // empties out the html

  movielist = JSON.parse(sessionStorage.getItem("movielist"));
  // Checks to see if we have any movies in localStorage
  // If we do, set the local list variable to our default movies
  if (!Array.isArray(movielist)) {
    movielist = ["Sharknado", "Forrest Gump", "Stargate", "Jurassic Park"];
    sessionStorage.setItem("movielist", JSON.stringify(movielist));
  }

  addButton(movielist);
}

function addButton(movielist) {
  // render our  movielist to the page
  for (var i = 0; i < movielist.length; i++) {
    // creates a button with the movie on it
    var p = $('<button class="movie" value="' + movielist[i] + '">').text(movielist[i]);
    // adds a delete button which will prepend to the movie button = multi function button
    var b = $("<button class='delete'>").text("delete").attr("data-index", i);
    // prepends delete button to movie
    p.prepend(b);
    // prepends multi function button to jumbotron
    $("#movie-list").prepend(p);
  }
}

function buildQueryURL(movieChoice) {
  // Set the API key etc.
  var api_key = "6xQw9xsRZt7g9oQl4Ayu08BrwmKEMytc";
  var movie = movieChoice.replace(" ", "_");
  var limit = 20;
  var rating = "PG";
  var langChoice = "en";

  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + api_key + "&q=" + movie + "&limit=" + limit + "&offset=0&rating=" + rating + "&lang=" + langChoice;

  return queryURL;
}

// get storage >> add Button to render onto page
getStorage();


// Click button events

// Click button to delete
$(document).on("click", "button.delete", function () {

  movielist = JSON.parse(sessionStorage.getItem("movielist"));
  var currentIndex = $(this).attr("data-index");

  // Deletes the item marked for deletion
  movielist.splice(currentIndex, 1);
  // Sets the array without the deleted item in the local storage
  sessionStorage.setItem("movielist", JSON.stringify(movielist));
  // Rsets out the buttons again but without the recently spliced item from the array
  event.stopPropagation();

  getStorage();
  return false;
});

// Click button for GIPHY
$(document).on("click", "button.movie", function () {
  // get the movie choice from the value
  var movieChoice = $(this).attr("value");
  // Sent moviechoice into the url constructor
  var queryURL = buildQueryURL(movieChoice);
  // Make the AJAX request to the API - GETs the JSON data at the queryURL.
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    $(".giphyLander").empty();
    console.log(response);

    for (var i = 0; i < response.data.length; i++) {

      var imagePath = response.data[i].images;

      // <div class="card" style="width: 18rem;">
      //   <img class="card-img-top" src=".../100px180/" alt="Card image cap">
      //     <div class="card-body">
      //       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      //     </div>
      //   </div>
      // This is the bootstrap format I'm creating with javascript
      $(".giphyLander").append("<div class='card' id='"+i+"' style='width: 15rem;'>");


        var movieImage = $("<img>")
        movieImage.attr("src", imagePath.fixed_width_still.url);
        movieImage.attr("data-animate", imagePath.fixed_width.url);
        movieImage.attr("data-still", imagePath.fixed_width_still.url);
        movieImage.attr("data-state","still");
        movieImage.addClass("gif");
  
        $('#'+i+'').append(movieImage);
        $('#'+i+'').append("<div class='card-body' id = 'card-"+i+"'>");
        $('#card-'+i+'').append("<p class='card-text'> <strong>Rating: </strong> "+response.data[i].rating+" </p>");
  
      }
    });
  });
  // click event to animate gifs. I PROMISE I figured this out by myself in class. it was just easier to copy in paste while I did the homework.
$("body").on("click",".gif", function() {
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
          // If the clicked image's state is still, update its src attribute to what its data-animate value is.
          // Then, set the image's data-state to animate
          // Else set src to the data-still value
  if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
  } else {
            $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
      });
// Click event to add a new movie to the list
      var itemFound = -1;
$("#addMovie").on("click", function (event) {
            event.preventDefault();
          // Setting the input value to a variable and then clearing the input
          var val = $("#userMovie").val();
          // Empties the val box
          $("#userMovie").val("");
          //check if the input value already exists
          itemFound = movielist.indexOf(val);
        
  if (val && itemFound === -1) {
            // adds to array
            movielist.push(val);
          // sets array with new items to storage
          sessionStorage.setItem("movielist", JSON.stringify(movielist));
          // calls function to put button on page
          getStorage();
  } else {
            alert("Please Type Something New")
          }
          });