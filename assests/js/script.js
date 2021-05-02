var todayDate = moment().format("(MM/DD/YYYY)");
var APIKEY = "88ab5694ae8be95b14ad32b45072a328";
//"http://openweathermap.org/img/w/" + iconcode + ".png"; for icon

function currentDateWeather(city) {
  $("#city-date").html("<h3>" + city + " " + todayDate + "</h3>");
  let apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKEY;

  let apiObj = fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        apiObj = data;

        let iconCode = apiObj.weather[0].icon;
        $("#current-icon").attr(
          "src",
          "http://openweathermap.org/img/w/" + iconCode + ".png"
        );

        let lon = apiObj.coord.lon;
        let lat = apiObj.coord.lat;

        let uvURL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          APIKEY;

        $("#current-temp").html("<p>Temp: " + apiObj.main.temp + " °F</p>");
        $("#current-wind").html("<p>Wind: " + apiObj.wind.speed + " MPH</p>");
        $("#current-humid").html(
          "<p>Humidity: " + apiObj.main.humidity + "%</p>"
        );

        fetch(uvURL).then(function (response) {
          if (response.ok) {
            response.json().then(function (uvdata) {
              let uv = uvdata.current.uvi;

              if (uv < 3) {
                $("#current-uv").html(
                  "<p class='text-success'>UV Index: " + uv + "</p>"
                );
              } else if (uv >= 3 && uv <= 6) {
                $("#current-uv").html(
                  "<p class='text-warning'>UV Index: " + uv + "</p>"
                );
              } else {
                $("#current-uv").html(
                  "<p class='text-danger'>UV Index: " + uv + "</p>"
                );
              }
            });
          } else {
            console.log("didnt get uv");
          }
        });
      });
    } else {
      console.log("error");
    }
  });
}

function fiveDayForecast(city) {
  let apiURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    APIKEY;

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        $("#five-day-forecast").empty();

        for (let i = 0; i <= 40; i += 8) {
          //TODO: Here is where I create and append cards to five-day-forecast
          let cardTitle = $(
            "<h5 class='card-title'>" + data.list[i].dt_txt + "</h5>"
          );

          let cardImg = $(
            "<img class='card-img' src=" +
              "http://openweathermap.org/img/w/" +
              data.list[i].weather[0].icon +
              ".png />"
          );

          let cardTemp = $(
            "<p class='card-text'>Temp: " + data.list[i].main.temp + "°F</p>"
          );

          let cardWind = $(
            "<p class='card-text'>Wind: " + data.list[i].wind.speed + "MPH</p>"
          );

          let cardHumid = $(
            "<p class='card-text'>Humidity: " +
              data.list[i].main.humidity +
              "%</p>"
          );

          let cardBody = $("<div class='card-body'></div>");

          cardTitle.appendTo(cardBody);
          cardImg.appendTo(cardBody);
          cardTemp.appendTo(cardBody);
          cardWind.appendTo(cardBody);
          cardHumid.appendTo(cardBody);

          let card = $(
            "<div class='col card text-white bg-info mr-2' style='width:18rem'></div>"
          );

          cardBody.appendTo(card);

          card.appendTo("#five-day-forecast");
        }
      });
    } else {
      console.log("error pulling dates");
    }
  });
}
$("#searchBtn").click(function () {
  let userInput = $("#userCity").val();

  currentDateWeather(userInput);

  fiveDayForecast(userInput);

  //For 5 weather forcast go through "list" array every 8 times to get the data for next day
});
