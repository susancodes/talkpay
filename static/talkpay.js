
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
}


function drawChart(chartData) {
	var salaryList = chartData;

	var data = google.visualization.arrayToDataTable([
        [" ", "Salary", { role: "style" } ],
        ["Male", 15.94, "blue"],
        ["Silver", 10.49, "pink"],
        ["Gold", 13.30, "green"],
      ]);

	var view = new google.visualization.DataView(data);
	view.setColumns([0, 1,
	               { calc: "stringify",
	                 sourceColumn: 1,
	                 type: "string",
	                 role: "annotation" },
	               2]);


	var options = {
		title: "Salary Comparison by Gender",
		legend: {position: 'bottom'},
		vAxis: {title: 'Salary'},
		hAxis: {title: 'Gender'},
		bar: {groupWidth: "95%"},
	}

	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	chart.draw(view, options);

}