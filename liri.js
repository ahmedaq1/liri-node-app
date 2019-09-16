// LIRI APP

require("dotenv").config();
//Variables for the application 
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var moment = require('moment');
moment().format();

var axios = require('axios');

var fs = require('fs');

var command = process.argv[2];
var value = process.argv[3];

//key words to call the function
switch (command) {
    case "concert-this":
        concert(value);
        break;
    case "spotify-this-song":
        spotifyMusic(value);
        break;
    case "movie-this":
        movie(value);
        break;
    case "do-what-it-says":
        doIt();
        break;
};



function concert(value) {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function(response) {
            for (var i = 0; i < response.data.length; i++) {

                var datetime = response.data[i].datetime;
                var dateArr = datetime.split(', ');

                var concertResults =
                    "--------------------------------------------------------------------" +
                    "\nVenue : " + response.data[i].venue.name +
                    "\nLocation: " + response.data[i].venue.city +
                    "\nTime: " + moment(dateArr[0], "MM-DD-YYYY");
                console.log(concertResults);
            }
        })
        .catch(function(error) {
            console.log(error);
        });


}

function spotifyMusic(value) {
    if (!value) {
        value = "The Sign";
    }
    spotify
        .search({ type: 'track', query: value })
        .then(function(response) {
            for (var i = 0; i < 5; i++) {
                var spotifyResults =
                    "--------------------------------------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;

                console.log(spotifyResults);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movie(value) {
    if (!value) {
        value = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            var movieResults =
                "--------------------------------------------------------------------" +
                "\nMovie Title: " + response.data.Title +
                "\nYear of Release: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry Produced: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors/Actresses: " + response.data.Actors;
            console.log(movieResults);
        })
        .catch(function(error) {
            console.log(error);
        });

}

function doIt() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        spotify(dataArr[0], dataArr[1]);
    })
}