
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
}


function drawChart(chartData) {
	var salaryList = chartData

	var data = new google.visualization.DataTable();

	var options = {
		title: "Salary Comparison by Gender",
	}

	var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
	chart.draw(data, options);
}