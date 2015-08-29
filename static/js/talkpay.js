
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
	$("#position-search").on('submit', getSalaryInfo);
}


function drawChart(chartData, herSalary) {
	var salaryObject = chartData;

	var menSalary = "$" + salaryObject.men;
	var womenSalary = "$" + salaryObject.women;

	var menSalaryInt = salaryObject.men;
	var womenSalaryInt = salaryObject.women;

	var herSalary = "$" + herSalary;
	var herSalaryInt = parseInt(herSalary);

	console.log('menSalary ' + menSalary);
	console.log('menSalaryInt ' + menSalaryInt);
	console.log('womenSalary ' + womenSalary);
	console.log('womenSalaryInt ' + womenSalaryInt);
	console.log('herSalary ' + womenSalary);
	console.log('herSalaryInt' + womenSalaryInt);


	// var data = google.visualization.arrayToDataTable([
 //        ["Gender", "Salary", {role: 'annotation'}, 
 //        		"Salary Difference", {role: 'annotation'}, 
 //        		{ role: "style" } ],
 //        ["Male", 15.49, "15.49", 0, "0", "blue"],
 //        ["Female", 10.49, "10.49", 5, "5", "pink"]
 //      ]);

	var data = new google.visualization.DataTable();

	var options = {
		// title: "Annual Salary for " + salaryObject.title ,
		legend: {position: 'none'},
		axisTitlePosition: 'none',
		top: 0,
		height: 400,
		width: 400,
		animation: {
					duration: 3000,
					easing: 'out'},
		isStacked: true,
		vAxis: {
				// title: 'Salary',
				format: 'currency',
				textColor: '#fff',
				gridlines: {color: 'transparent'}},
		// hAxis: {title: 'Gender'},
		bar: {groupWidth: "95%"}
	};

		data.addColumn('string', 'Gender');
		data.addColumn('number', 'Salary');
		data.addColumn({type:'string', role:'annotation'});

	var chart = new google.visualization.ColumnChart(document.getElementById('chart-div'));
	
	function drawInitialChart() {
		data.addRows([
			["Male", menSalaryInt, menSalary],
			["Female", womenSalaryInt, womenSalary]
		]);
		chart.draw(data, options);
		
	}

	function reDrawChart() {

		var diffSalaryInt = (menSalaryInt - womenSalaryInt);
		var diffSalary = "$" + diffSalaryInt

		var currentDiffInt = (menSalaryInt - herSalaryInt);
		var currentDiff = "$" + currentDiffInt;

		console.log("diffSalary " + diffSalary);
		console.log("diffSalaryInt " + diffSalaryInt);

		console.log("currentDiff " + currentDiff);
		console.log("currentDiffInt" + currentDiffInt);


		data.addColumn('number', 'Salary Difference');
		data.addColumn({type: 'string', role: 'annotation'});

		data.removeRows(0, data.getNumberOfRows());
		data.addRows([
			["Male", menSalaryInt, menSalary, 0, ""], 
			["Female", womenSalaryInt, womenSalary, diffSalaryInt, diffSalary],
			["You", herSalaryInt, herSalary, currentDiffInt, currentDiff]
			]);

		options.height = 700;
		options.width = 500;

		chart.draw(data, options)

	};


	drawInitialChart();
	setTimeout(reDrawChart, 500);

};



function getSalaryInfo(evt) {

	evt.preventDefault();

	var url = '/processsearch.json?position=' + $("#position").val();
	console.log(url);

	$.get(url, function(data){
		console.log("AJAX IS WORKING");
		var salaryObject = data;
		console.log(salaryObject);

		var herSalary = $('#current-salary').val();

		drawChart(salaryObject, herSalary);


	})
}


function showErrorMessage() {
	$("#flash-message").html("<p>Your search returned no results.</p>");
	$("#flash-message").show();
}


function showGoodNews() {
	$("#chart-result-msg").html("<p>Congratulations! You're actively part of the movement to close the pay gap!</p>
								<p>We encourage you to share your success story with other women to empower them to join
								the movement to get paid what they're worth.</p>");
	$("#chart-result-msg").show();
}


function showBadNews() {
	$("#chart-result-msg").html("<p>This is a perfect time to sharpen your negotiation skills and ask for a raise!</p>
								<p>Reach out to other women in your industry and start #TalkPay.<p>");
	$("#chart-result-msg").show();
}



