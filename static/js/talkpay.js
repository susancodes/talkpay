
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

	// var data = google.visualization.arrayToDataTable([
 //        ["Gender", "Salary", {role: 'annotation'}, 
 //        		"Salary Difference", {role: 'annotation'}, 
 //        		{ role: "style" } ],
 //        ["Male", 15.49, "15.49", 0, "0", "blue"],
 //        ["Female", 10.49, "10.49", 5, "5", "pink"]
 //      ]);

	var data = new google.visualization.DataTable();



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
		legend: {position: 'none'},
		height: 400,
		width: 300,
		animation: {
					duration: 3000,
					easing: 'out'},
		isStacked: true,
		vAxis: {title: 'Salary',
				format: 'currency',
				gridlines: {color: 'transparent'}},
		hAxis: {title: 'Gender'},
		bar: {groupWidth: "95%"}
	};

		data.addColumn('string', 'Gender');
		data.addColumn('number', 'Salary');
		data.addColumn({type:'string', role:'annotation', calc: function(dt, row) {
			var salary = dt.getValue(row, 2);
			return {v: salary_diff, f: "$" + salary_diff.toString()};
		}});

	var chart = new google.visualization.ColumnChart(document.getElementById('chart-div'));
	
	function drawInitialChart() {
		data.addRows([
			["Male", 15.49, 15.49],
			["Female", 10.49, 10.49]
		]);
		chart.draw(data, options);
		
	}

	function reDrawChart() {

		data.addColumn('number', 'Salary Difference');
		data.addColumn({type: 'string', role: 'annotation'});

		data.removeRows(0, data.getNumberOfRows());
		data.addRows([
			["Male", 15.49, 15.49, 0, ""], ["Female", 10.49, 10.49, 5,"$5"]
			]);

		options.height = 600;
		options.width = 450;

		chart.draw(data, options)

	};


	drawInitialChart();
	setTimeout(reDrawChart, 500);

};



// $('#another-chart-btn').on('click', reDrawChart);

function getSalaryInfo() {
	var url = '/processsearch.json?title=' + "Computer";

	$.get(url, function(data){
		alert("getting an ajax call back");
		var salaryList = data;
		console.log(salaryList);



	})
}


function showErrorMessage() {
	$("#flash-message").html("<p>Your search returned no results.<p>");
	$("#flash-message").show();
}


