$(document).ready(function(){//wait for static html to load

//------------------//initialize firebase//------------------//
	var config = {
	apiKey: "AIzaSyC_eoVgyUGBIaomumaX_DJ9u2t6RPzWycw",
	authDomain: "trainschedule-c2c7e.firebaseapp.com",
	databaseURL: "https://trainschedule-c2c7e.firebaseio.com",
	projectId: "trainschedule-c2c7e",
	storageBucket: "",
	messagingSenderId: "462239142717"
	};
	//configure
	firebase.initializeApp(config);

//----//configure momentjs - duration.humanize settings//----//

	moment.relativeTimeThreshold('ss', 5);
	moment.relativeTimeThreshold('s', 55);
	moment.relativeTimeThreshold('m', 60);
	moment.relativeTimeThreshold('h', 24);
	moment.relativeTimeThreshold('d', 28);
	moment.relativeTimeThreshold('M', 12);

//--------------------//global variables//-------------------//

//global database variable
	var database = firebase.database();

//global array to track scheduled trains locally
	var trainsArray = [];

//--------------------//event listeners//--------------------//

//add train form submission listener
	$("#submit-button").on("click", function (event) {
		event.preventDefault();
		//capture values from "add train" form
		var name = $("#name").val().trim();
		var destination = $("#destination").val().trim();
		var start = $("#start").val();
		var frequency = $("#frequency").val().trim();
		//push values to database to add train
		database.ref().push({
			name: name,
			destination: destination,
			start: start,
			frequency: frequency
		});
		//clear form
		$("#employee-form").trigger("reset");
	})

//update local trainsArray and re-renderTableData when child is added to database
	database.ref().on("child_added", function (snapshot) {
		var key = snapshot.key;
		var addedChild = snapshot.val();
		for (train in addedChild){
		}
		trainsArray.push({
			key: key,
			name: addedChild.name,
			destination: addedChild.destination,
			start: addedChild.start,
			frequency: addedChild.frequency,
			//these two time values will be calculated by renderTableData()
			nextArrival: null,
			minutesAway: null
		});
		renderTableData(trainsArray);
	});

//-----------------------//functions//-----------------------//

//set database to empty object
	function resetDB(){
		database.ref().set({
		});
	}
	//resetDB();

//update times on schedule every nSeconds by calling renderTableData()
	function timer(nSeconds){
		var counter = setInterval(function(){
			renderTableData(trainsArray);
		}, nSeconds * 1000);
	}

//start timer
	timer(1);

//erase and re-render scheduled trains in table
	function renderTableData(trainsArray) {
		//clear schedule table
		$("#table-body").empty();
		//create table elements for each train in array
		trainsArray.forEach(function(child){
			//update time values based on current time
			var firstTrain = moment(child.start, "HH:mm");
			var minutesSinceFirstTrain = (moment().diff(firstTrain, "m"));//works
			var nextTime = firstTrain.add(Math.ceil(minutesSinceFirstTrain/child.frequency) * child.frequency, "m");
			//update time values in trainsArray
			child.nextArrival = nextTime.format("HH:mm");
			child.minutesAway = nextTime.fromNow();
			var key = child.key
			//database key for train added to table row id to facilitate deletion
			var newRow = $("<tr id='" + key + "'>");
			newRow.append($("<td>").text(child.name));
			newRow.append($("<td>").text(child.destination));
			newRow.append($("<td>").text(child.frequency));
			newRow.append($("<td>").text(child.nextArrival));
			newRow.append($("<td>").text(child.minutesAway));
			//get and append delete button
			newRow.append(makeDeleteButton(key));
			//append row to table
			$("#table-body").append(newRow);
		});
		$("#current-time").text(moment().format("HH:mm:ss"));
	}

//create delete button with event listener to remove train whose key is passed from schedule table
	function makeDeleteButton(key){
		var deleteButton = $("<button class='btn btn-danger' id='delete-" + key + "'>")
		.text("X")
		//event listener attached to this delete button
		.on("click", function(){
			//delete train from database
			database.ref(key).remove()
			.then(function() {
				//remove train's table row from html
				$("#"+key).remove();
				trainsArray.forEach(function(child){
					//find and remove train from trainsArray
					if(child.key === key){
						var index = trainsArray.indexOf(child);
						trainsArray.splice(index, 1);
					}
				});
			})
			.catch(function(error) {
				console.log("Remove failed: " + error.message)
			});
		});
		return deleteButton;
	}

});//end of $(document).ready()