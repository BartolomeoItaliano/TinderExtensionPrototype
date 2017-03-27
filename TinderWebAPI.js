var tinderLoggedUserData = {
    token: "8170e332-3c23-4c06-af22-77a657250ff8"
};

var TinderWebAPI = {
    tinderAuthenticate: function () {
        var params = {
            facebook_token: "EAAGm0PX4ZCpsBAFOVERFjKqahx4UkWe3igKr4Jk2ewV5fhjrCljM93JNPY1KKhLZACsEM07MfKyjQSq3uABWgyw9SC4AVrhJZAPAJbuOzZA5bMFfvFeCmt0M19wRZBzujfFpKobWYT6XBEVkn7wHZA3aSA0p0g6p6RPMxdsb0rLOdvx3wHPFPpy7CThI2Vd2B4pGujcnMa8nmMqekQmvRv08pcuDkJPZArSlU8iWwLmQQzGB9OqzvLsRurZC7TMG1TwZD",
            facebook_id: "100002666132376"
        };
        var JSONparams = JSON.stringify(params);
        var http = new XMLHttpRequest();
        http.open('POST', 'https://api.gotinder.com/auth', true);
        http.setRequestHeader('content-type', 'application/json');

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                tinderLoggedUserData = JSON.parse(http.responseText);
                console.log("You've been authenticated", http.responseText, tinderLoggedUserData);
            }
            else if (http.readyState == 4 && http.status == 401) {
                console.log("Your token expired");
            }
        }
        http.send(JSONparams);
    },


    tinderUpdatePosition: function (lat, lon, callback) {

        var http = new XMLHttpRequest();
        http.open('POST', 'https://api.gotinder.com/user/ping', true);
        http.setRequestHeader('content-type', 'application/json');
        http.setRequestHeader('X-Auth-Token', tinderLoggedUserData.token);


        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                console.log("Position Updated", http.responseText);
                callback(JSON.parse(http.responseText));
            }
            else if (http.readyState == 4) {
                console.log(http.responseText);
                callback(JSON.parse(http.responseText));
            }

        }
        var position = {
            lat: lat,
            lon: lon
        };
        http.send(JSON.stringify(position));
    },


    tinderMyMatches: function (callback) {
        var http = new XMLHttpRequest();
        http.open('post', 'https://api.gotinder.com/updates', true);
        http.setRequestHeader('content-type', 'application/json');
        http.setRequestHeader('X-Auth-Token', tinderLoggedUserData.token);


        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                console.log("Your updated matches", JSON.parse(http.responseText));
                callback(JSON.parse(http.responseText));
            }
            else if (http.readyState == 4) {
                console.log(http.responseText);
                callback(JSON.parse(http.responseText));
            }
        }
        var limit = {limit: 10};
        http.send(JSON.stringify(limit));
    },

    tinderRecommendations: function (callback) {
        var http = new XMLHttpRequest();
        http.open('get', 'https://api.gotinder.com/user/recs', true);
        http.setRequestHeader('content-type', 'application/json');
        http.setRequestHeader('X-Auth-Token', tinderLoggedUserData.token);


        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                console.log("Your recomendations", JSON.parse(http.responseText));
                callback(JSON.parse(http.responseText));
            }
            else if (http.readyState == 4) {
                console.log("something went wrong", http.responseText);
                callback(JSON.parse(http.responseText));
            }
        }
        var limit = {limit: 10};
        http.send(JSON.stringify(limit));
    },


    getUserDetails: function (id, callback) {

        var http = new XMLHttpRequest();
        http.open('get', 'https://api.gotinder.com/user/' + id +'?asd='+new Date().getTime(), true);
        http.setRequestHeader('content-type', 'application/json');
        http.setRequestHeader('Pragma','no-cache');
        http.setRequestHeader('Cache-Control','no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        http.setRequestHeader('Expires','0');
        http.setRequestHeader('X-Auth-Token', tinderLoggedUserData.token);


        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                console.log("User details", JSON.parse(http.responseText));
                callback(JSON.parse(http.responseText));
            }
            else if (http.readyState == 4) {
                console.log(http.responseText);
                callback(JSON.parse(http.responseText));
            }
        }
        http.send();
    }
}