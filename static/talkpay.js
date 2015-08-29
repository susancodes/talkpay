
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
	debugger;
	$('#chart-btn').on('click', drawChart);
}


function drawChart() {
	// var salaryList = chartData;

	var data = google.visualization.arrayToDataTable([
        ["Gender", "Salary", {role: 'annotation'}, 
        		"Salary Difference", {role: 'annotation'}, 
        		{ role: "style" } ],
        ["Male", 15.49, "15.49", 0, "0", "blue"],
        ["Female", 10.49, "10.49", 5, "5", "pink"],
        ["Both", 13.30, "13.30", 0, "0", "green"]
      ]);

	// var view = new google.visualization.DataView(data);
	// view.setColumns([{
	// 	label: 'Gender',
	// 	type: 'string',}, 

	// 	{label: 'Salary',
	// 	type: 'number',
	// 	calc: function (dt, row) {
	// 		var salary = dt.getValue(row, 1);
	// 		return parseInt(salary);
	// 	}}, 

	// 		{role: 'annotation',
	// 		type: 'string',
	// 		calc: function (dt, row) {
	// 			var salary = dt.getValue(row, 1);
	// 			return {v: salary, f: salary.toString()};
	// 		}}, 
		
	// 	{label: 'Salary Difference',
	// 	type: 'number',
	// 	calc: function (dt, row) {
	// 	var salary_diff = dt.getValue(row, 2);
	// 	return parseInt(salary_diff);
	// 	}}, 

	// 		{role: 'annotation',
	// 		type: 'string',
	// 		calc: function (dt, row) {
	// 			var salary_diff = dt.getValue(row, 2);
	// 			return {v: salary_diff, f:salary_diff.toString()};
	// 		}
	// 	}]);


	var options = {
		title: "Salary Comparison by Gender",
		height: 600,
		width: 400,
		// animation: {startup: true,
		// 			duration: 2000,
		// 			easing: 'out'},
		isStacked: true,
		vAxis: {title: 'Salary'},
		hAxis: {title: 'Gender'},
		bar: {groupWidth: "95%"}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('chart-div'));
	chart.draw(data, options);

};