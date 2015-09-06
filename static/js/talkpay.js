
// this is for the google charts
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(initialize);


function initialize() {
	// add event listener here after google chart initializes
	$("#position-search").on('click', getSalaryInfo);
}


function drawChart(chartData, herSalary) {
	var salaryObject = chartData;

	var menSalary = "$" + salaryObject.men;
	var womenSalary = "$" + salaryObject.women;

	var menSalaryInt = salaryObject.men;
	var womenSalaryInt = salaryObject.women;

	var herSalaryInt = herSalary;
	var herSalary = "$" + herSalaryInt;

	console.log(typeof herSalaryInt)

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
		// axisTitlePosition: 'none',
		top: 0,
		height: 550,
		chartArea: {
			height: '50%',
			width: '50%'
		},
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
		
	};

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

		options.chartArea.height = '90%';
		options.chartArea.width = '90%';

		chart.draw(data, options)

		if (currentDiffInt < menSalaryInt){
			$("form#position-search").fadeOut(3000);
			$("img#logo").animate({
				height: 100,
				width: 100,
			}, 3000);
			// $("div#sidebar").animate({
				// top: 100}, 400);
			setTimeout(function(){showBadNews(currentDiff)}, 2000);
		} else {
			$("form#position-search").fadeOut(3000);
			$("img#logo").animate({
				height: 50,
				width: 50,
			}, 3000);
			setTimeout(showGoodNews, 2000);
			
		}

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
		herSalary = parseInt(herSalary);
		console.log('herSalary ' + herSalary);
		console.log(typeof herSalary);

		drawChart(salaryObject, herSalary);


	})
}


function showErrorMessage() {
	$("#flash-message").html("<p>Your search returned no results.</p>");
	$("#flash-message").show();
}


function showGoodNews() {
	$("#chart-result-msg").html("<p>Congratulations! You're actively part of the movement to close the pay gap!</p>" +
								"<p>We encourage you to share your success story with other women to empower them to join" +
								"the movement to get paid what they're worth.</p>");
	$("#search-again").fadeIn(3000);
	$("#chart-result-msg").fadeIn(3000);
}


function showBadNews(currentDiff) {
	$("#chart-result-msg").html("<p style='font-size: 20'><b>Sharpen your negotiation skills and ask for a raise!</b></p>" + 
								"<p>You're currently making " + currentDiff + " less than the average men in your industry.<p>" +
								"<p>Reach out to other women and start #TalkPay.<p>");
	$("#search-again").fadeIn(3000);
	$("#chart-result-msg").fadeIn(3000);
}


$('button#search-again').on('click', function (){
	$("form#position-search").fadeIn(3000);
	$("#search-again").fadeOut(3000);


})



