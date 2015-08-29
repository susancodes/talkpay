
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
	$("#position-search").on('submit', getSalaryInfo);
}


function drawChart(chartData) {
	var salaryObject = chartData;

	var men_salary = "$" + salaryObject.men;
	var women_salary = "$" + salaryObject.women;

	var men_salary_int = salaryObject.men;
	var women_salary_int = salaryObject.women;

	console.log('men_salary ' + men_salary);
	console.log('men_salary_int ' + men_salary_int);
	console.log('women_salary ' + women_salary);
	console.log('women_salary_int ' + women_salary_int);


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
		title: "Annual Salary for " + salaryObject.title ,
		legend: {position: 'none'},
		height: 300,
		width: 200,
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
		data.addColumn({type:'string', role:'annotation'});

	var chart = new google.visualization.ColumnChart(document.getElementById('chart-div'));
	
	function drawInitialChart() {
		data.addRows([
			["Male", men_salary_int, men_salary],
			["Female", women_salary_int, women_salary]
		]);
		chart.draw(data, options);
		
	}

	function reDrawChart() {

		var diff_salary_int = (men_salary_int - women_salary_int);
		var diff_salary = "$" + diff_salary_int

		console.log("diff_salary" + diff_salary);
		console.log("diff_salary_int" + diff_salary_int);


		data.addColumn('number', 'Salary Difference');
		data.addColumn({type: 'string', role: 'annotation'});

		data.removeRows(0, data.getNumberOfRows());
		data.addRows([
			["Male", men_salary_int, men_salary, 0, ""], ["Female", women_salary_int, women_salary, diff_salary_int, diff_salary]
			]);

		options.height = 500;
		options.width = 333;

		chart.draw(data, options)

	};


	drawInitialChart();
	setTimeout(reDrawChart, 500);

};



// $('#another-chart-btn').on('click', reDrawChart);



function getSalaryInfo(evt) {

	evt.preventDefault();

	var url = '/processsearch.json?position=' + $("#position").val();
	console.log(url);

	$.get(url, function(data){
		console.log("AJAX IS WORKING");
		var salaryObject = data;
		console.log(salaryObject);

		drawChart(salaryObject);


	})
}


function showErrorMessage() {
	$("#flash-message").html("<p>Your search returned no results.<p>");
	$("#flash-message").show();
}


