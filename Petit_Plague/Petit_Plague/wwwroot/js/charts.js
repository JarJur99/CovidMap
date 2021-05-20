function GenerateMap() {
    // Themes begin
    am4core.useTheme(am4themes_myTheme);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var continents = {
        "AF": 0,
        "AN": 0,
        "AS": 0,
        "EU": 0,
        "NA": 0,
        "OC": 0,
        "SA": 0
    }

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.projection = new am4maps.projections.Mercator();

    // Create map polygon series for world map
    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.useGeodata = true;
    worldSeries.geodata = am4geodata_worldLow;
    worldSeries.exclude = ["AQ"];

    var worldPolygon = worldSeries.mapPolygons.template;
    worldPolygon.tooltipText = "Country : {countryName}" +
        "\n Total Cases : {totalCases}" +
        "\n Total Deaths : {totalDeaths}";
    worldPolygon.nonScalingStroke = true;
    worldPolygon.strokeOpacity = 0.5;
    worldPolygon.fill = am4core.color("#05163d");
    worldPolygon.propertyFields.fill = "color";

    var hs = worldPolygon.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(1);

    // Set up click events
    worldPolygon.events.on("hit", function (ev) {
        var slug = ev.target.dataItem.dataContext.slug
        var countryName = ev.target.dataItem.dataContext.countryName
        let promisedData = new Promise((resolve, reject) => {
            var data = getDataFromAPI(slug)
                resolve(data)
        })
        promisedData.then((data) => {
            console.log(data)
            var dataToPlot = prepareDataToPlot(data)
            console.log(dataToPlot)
            if (dataToPlot.length > 0) 
                generateLineChart(dataToPlot, countryName)
        })
    });


    $.getJSON("https://api.covid19api.com/summary", function (countryInfos) {

        // Set up data for countries
        var data = [];
        var fullCountriesInfo = countryInfos.Countries;
        var nTotalCases = "",
            nTotalDeaths = "",
            countrySlug = "";

        for (var id in am4geodata_data_countries2) {
            if (am4geodata_data_countries2.hasOwnProperty(id)) {

                var country = am4geodata_data_countries2[id];

                if (country.maps.length) {
   
                    fullCountriesInfo.forEach(countryData => {
                        if (countryData.CountryCode == id) {
                                nTotalCases = countryData.TotalConfirmed;
                            nTotalDeaths = countryData.TotalDeaths;
                            countrySlug = countryData.Slug;
                        }
                    })
                                    
                    data.push({
                        id: id,
                        color: chart.colors.getIndex(continents[country.continent_code]),
                        map: country.maps[0],
                        countryName: country.country,
                        totalCases: nTotalCases,
                        totalDeaths: nTotalDeaths,
                        slug: countrySlug
                    });
                }
            }
        }
        worldSeries.data = data;

        // Zoom control
        chart.zoomControl = new am4maps.ZoomControl();
    });   
}

async function getStatisticData(slug, dStart, dStop) { // Daty w formacie ISO! YYYY-MM-DD
    var url = "https://api.covid19api.com/total/country/" + slug + "?from=" + dStart + "T00:00:00Z&to=" + dStop + "T00:00:00Z"
    var data = []
    await $.getJSON(url, function (countryInfo) {
            var confirmed,
                deaths,
                recovered,
                deaths,
                active,
                date

            countryInfo.forEach(day => {
                confirmed = day.Confirmed
                deaths = day.Deaths
                recovered = day.Recovered
                active = day.Active
                date = day.Date

                data.push({
                    cDate: date,
                    cConfirmed: confirmed,
                    cDeaths: deaths,
                    cRecover: recovered,
                    cActive: active
                })
            })
        }
    );
    return data;
}

function getDataFromAPI(slug) {
    var CountryDataInfo = []
    var dStart = document.getElementById("datePickerStart").value;
    var dStop = document.getElementById("datePickerEnd").value;
    if (dStart != "" && dStop != "") 
        CountryDataInfo = getStatisticData(slug, dStart, dStop)
    return CountryDataInfo
}

function prepareDataToPlot(data) {
    dataToPlot = []
    var thisDate,
        thisConfirmed,
        thisActive,
        thisRecovered, 
        thisDeaths
    data.forEach(record => {
        thisDate = new Date(record.cDate)
        thisConfirmed = record.cConfirmed
        thisActive = record.cActive
        thisRecovered = record.cRecover
        thisDeaths = record.cDeaths

        dataToPlot.push({
            "date" : thisDate,
            "confirmed" : thisConfirmed,
            "active" : thisActive,
            "recovered" : thisRecovered,
            "deaths" : thisDeaths
        })
    })
    return dataToPlot
}