$()
{
    var searchInput = $("#search-input");
    var recentCities = $("#recent-cities");

    loadButtonCity();

    // On Click Functions
    $("#search-button").on("click", function(){
        searchCity(searchInput.val());
    })

    function searchCity(cityName) {
        fiveDayForecast(cityName);
        searchInput.val('');
    }

    function fiveDayForecast (cityName) {
        var encode = encodeURI(cityName);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/forecast?q=" + encode,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": "fbc5e4c4acmsh767c21e0d464801p1d9b7bjsn100f1c2f34b8"
            }
        }
        
        $.ajax(settings).done(function (response) {
            console.log(response);

            // Add the cards for the 5-day.
            addCard(response);

            //Add info for today
            addWeather(response);
        });
    }

    function addWeather (data)
    {
        var cityButtonReturned = data.city.name;
        //Add the city to recent section
        recentCitiesMove(cityButtonReturned);

        //Add city info to display info section
        $('#location').text(data.city.name + " (" + getDate(data.list[0].dt_txt) + ")");
        //Clear the div
        $("#weather").empty();

        //City info properties
        var tempurature = $('<p>').text(`Temperature: ${kelvinToFahrenheit(data.list[0].main.temp)} ℉`);
        var humidity = $('<p>').text(`Humidity: ${data.list[0].main.humidity}%`);
        var wind = $('<p>').text(`Wind Speed: ${data.list[0].wind.speed} mph`);
        var uv = $('<p>').text(`UV Index: ${data.list[0].weather[0].id / 100}`);

        //Append to the parent
        $("#weather").append(tempurature);
        $("#weather").append(humidity);
        $("#weather").append(wind);
        $("#weather").append(uv);
    }

    function addCard (data) {
        $("#weatherContainer").empty();
        //For the 5 day forecast
        for (let i = 4; i < data.list.length; i = i + 8) 
            {
                //Save the iteration in a var
                var itr = data.list[i];

                //Set up cards
                var cardDiv = $('<div>');
                cardDiv.addClass("card text-white bg-primary mr-3");
                cardDiv.attr('style', 'max-width: 18rem;');

                //Append item to card
                var cardBody = $("<div>");
                cardBody.addClass("card-body");

                //Set up header
                var cardHeader = $('<h5>');
                cardHeader.addClass('card-title');
                cardHeader.text(getDate(data.list[i].dt_txt));

                //Set up info
                var cardInfo = $('<p>');
                cardInfo.addClass('card-text');
                cardInfo.html(`Temperature: ${kelvinToFahrenheit(data.list[i].main.temp)} ℉ <br> Humidity: ${data.list[i].main.humidity}%`);

                //Append card to parent
                cardDiv.append(cardBody);
                cardBody.append(cardHeader);
                cardBody.append(cardInfo);
                $('#weatherContainer').append(cardDiv);
            }
    }

    function kelvinToFahrenheit (kelvin)
    {
        var fahrenheit = Math.round(((kelvin-273.15)*1.8)+32);
        return fahrenheit;
    }

    function getDate (date)
    {
        return date.split(" ")[0];
    }

    function recentCitiesMove (cityName) {
        var repeatName = false;
        var repeatElement;

        recentCities.children().each((index, element) => {
            if($(element).text() == cityName) {
                repeatName = true;
                repeatElement = $(element);
                $(element).remove();
            }
        });

        if(!repeatName) {
            var cityButton = $('<button type="button" class="list-group-item list-group-item-action">');

            cityButton.click(function() {
                searchCity(cityName);
            });

            cityButton.text(cityName);

            recentCities.prepend(cityButton);

            if(recentCities.children().length > 5) {
                recentCities.contents().last().remove();
            }

            saveCity(cityName);
        }

        else {
            recentCities.prepend(repeatElement);
        }
    }

    function loadButtonCity () {
        var recentCitiesArr = getCityInfo();

        if(recentCitiesArr) {
            recentCitiesArr.forEach((item, index) => 
            {
                recentCitiesMove(item);
            });
        }
    }

    function getCityInfo () {
        var loadedString = localStorage.getItem('recentSearches')

        if(loadedString) {
            var cityArr = loadedString.split(',');
            return cityArr;
        }
        else {
            return;
        }
    }

    function saveCity (cityName) {
        var cityArr = getCityInfo();

        if (cityArr != null) {
            if(!cityArr.includes(cityName)) {
                localStorage.setItem('recentSearches', cityArr + "," + cityName);
            }
        } 
        else {
            localStorage.setItem('recentSearches', cityName);
        }
    }
}