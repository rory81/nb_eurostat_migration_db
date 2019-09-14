queue()
    .defer(d3.csv, "assets/data/migrationData.csv")
    .await(makeGraphs);

function makeGraphs(error, migrData) {
    var ndx = crossfilter(migrData);

    migrData.forEach(function(d) {
        d.Value = d["Value"].replace(/,/g, '');
        d.Value = parseInt(d["Value"]);
    })

    show_barChart(ndx);
    show_country_table(ndx);
    show_country_pie(ndx);
    // show_sex_table(ndx);
    // show_age_table(ndx);

    dc.renderAll();

}

function show_barChart(ndx) {
    var dim = ndx.dimension(dc.pluck('TIME'));
    var sumApplications = dim.group().reduceSum(dc.pluck('Value'));

    // function add_item(p, v) {
    //     p.total += v.Value;
    //     return p;
    // }

    // function remove_item(p, v) {
    //     p.total -= v.Value;
    //     return p;
    // }

    // function initialise() {
    //     return { total: 0 };
    // }

    // Total per year according to data
    // 2013	457630
    // 2014	663250
    // 2015	1394210
    // 2016	1293210
    // 2017	735410
    // 2018	665250

    dc.barChart('#total_asylum_applications_per_year')
        .width(300)
        .height(150)
        .useViewBoxResizing(true)
        .margins({ top: 10, right: 30, bottom: 30, left: 30 })
        .dimension(dim)
        .group(sumApplications)
        // .valueAccessor(function(d) {
        //     return d.value.total;
        // })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .ordinalColors(["#FF6600"])
        .yAxisLabel("# asylum applicants")
        .yAxis().ticks(5).tickFormat(function(d) { return d / 1000000 + " M" });

}

function show_country_pie(ndx) {
    var dim = ndx.dimension(dc.pluck('GEO'));
    var top5CountryPie = dim.group().reduceSum(dc.pluck('Value'));

    dc.pieChart('#top-5-pie')
        .width(330)
        .radius(90)
        .useViewBoxResizing(true)
        .dimension(dim)
        .group(top5CountryPie)
        .transitionDuration(1500)
        .cap(5)
        .legend(dc.legend().x(270).y(0).gap(5))
        .renderLabel(false);
}

function show_country_table(ndx) {
    var dim = ndx.dimension(dc.pluck('GEO'));
    // var countries = ndx.dimension(function (d) { return d.country });
    // var top5country = dim.group().reduceSum(function(d) { return d.country })

    dc.dataTable('#top-5')
        .width(250)
        .height(800)
        .useViewBoxResizing(true)
        .dimension(dim)
        .group(function(d) { return "" })
        // .valueAccessor(function(d) {
        //     return sum();
        // })
        .size(5)
        .columns([
            function(d) { return d.GEO; },
            function(d) { return d.Value; },
            // function(d) { return d.Percentage; },

        ])
        .sortBy(function(d) { return d.Value; })
        .order(d3.descending);

}
