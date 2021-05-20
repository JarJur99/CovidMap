function generateLineChart(dataToPlot, countryName) {
am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("lineChartDiv", am4charts.XYChart);

    chart.dateFormatter.dateFormat = "MMM YYYY";
    chart.numberFormatter.numberFormat = "#.#a";
    chart.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
    ];

    // Chart title
    var title = chart.titles.create();
    title.text = "Covid-19 dynamics for " + countryName;
    title.fontSize = 20;
    title.paddingBottom = 10;

    // Add data
    chart.data = dataToPlot

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = "bottom";
    valueAxis.renderer.labels.template.dx = -5;
    valueAxis.renderer.labels.template.dy = 10;
    valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.title.text = "Number of infections";
    valueAxis.title.marginRight = 5;

    // Create series
    function createSeries(field, name, color, dashed) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.name = name;
        series.tooltipText = "[bold]{name}[/]\n{dateX}: [b]{valueY}[/]";
        series.strokeWidth = 2;
        series.smoothing = "monotoneX";
        series.stroke = color;

        if (dashed) {
            series.strokeDasharray = "5 3";
        }

        return series;
    }

    createSeries("confirmed", "Confirmed", am4core.color("#B1B106"));
    createSeries("active", "Active", am4core.color("#D68C45"), true);
    createSeries("recovered", "Recovered", am4core.color("#2C6E49"), true);
    createSeries("deaths", "Deaths", am4core.color("#B1B106"), true);

    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();

}); // end am4core.ready()
}