$(document).ready(function(){

//initialize firebase

var config = {
apiKey: "AIzaSyC_eoVgyUGBIaomumaX_DJ9u2t6RPzWycw",
authDomain: "trainschedule-c2c7e.firebaseapp.com",
databaseURL: "https://trainschedule-c2c7e.firebaseio.com",
projectId: "trainschedule-c2c7e",
storageBucket: "",
messagingSenderId: "462239142717"
};
firebase.initializeApp(config);

var database = firebase.database();

//-----------------------//functions//-----------------------//

//set database to empty object
function resetDB(){
    database.ref().set({
    });
}
//resetDB();

//form submission listener
$("#submit-button").on("click", function (event) {
    event.preventDefault();

//form values obtained
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var start = $("#start").val();
    var frequency = $("#frequency").val().trim();

//push values to database
    database.ref().push({
        name: name,
        destination: destination,
        start: start,
        frequency: frequency
    });

//clear form
    $("#employee-form").trigger("reset");
})



var childArray = [];

function renderTableData() {
    $("#table-body").empty();
    childArray.forEach(function(child){
        var now = moment();
        console.log('now', now);
        var firstTrain = moment(child.start, "HH:mm");
        console.log("firstTrain ", firstTrain);
        var minutesSinceFirstTrain = (moment().diff(firstTrain, "m"));//works
        console.log("child.start", child.start);
        console.log("minutesSinceFirstTrain", minutesSinceFirstTrain);
        var nextTime = firstTrain.add(Math.ceil(minutesSinceFirstTrain/child.frequency) * child.frequency, "m");
        //console.log('nextOne', nextOne);

        console.log("child.minutesAway", child.minutesAway);
        child.nextArrival = nextTime.format("HH:mm");
        console.log('nextTime.format("HH:mm")', nextTime.format("HH:mm"));
        child.minutesAway = nextTime.fromNow();
        var key = child.key
        console.log('key', key);
        var newRow = $("<tr id='" + key + "'>");
        newRow.append($("<td>").text(child.name));
        newRow.append($("<td>").text(child.destination));
        newRow.append($("<td>").text(child.frequency));
        newRow.append($("<td>").text(child.nextArrival));
        newRow.append($("<td>").text(child.minutesAway));
        newRow.append(makeDeleteButton(key));
        $("#table-body").append(newRow);
    });
}

function makeDeleteButton(key){
    var deleteButton = $("<button class='btn btn-danger' id='delete-" + key + "'>")
    .text("X")
    .on("click", function(){
        console.log("delete button 'delete-" + key + "' clicked");
        database.ref(key).remove()
        .then(function() {
            console.log("Remove succeeded.")
            $("#"+key).remove();
        //$(this).remove();
            childArray.forEach(function(child){
                console.log("kid = ", child);
                if(child.key === key){
                    var index = childArray.indexOf(child);
                    childArray.splice(index, 1);
                    console.log(childArray[index], " removed.");
                    console.log('childArray = ', childArray);
                }
            });
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
    });
    return deleteButton;
}

//update local childArray and re-renderTableData when child is added to database
database.ref().on("child_added", function (snapshot) {
    var key = snapshot.key;
    var addedChild = snapshot.val();
    console.log('snapshot.key', snapshot.key)
    console.log("snapshot.val() = ", addedChild);
    for (train in addedChild){
        console.log("prop:", addedChild[train]);
    }
    childArray.push({
        key: key,
        name: addedChild.name,
        destination: addedChild.destination,
        start: addedChild.start,
        frequency: addedChild.frequency,
        nextArrival: null,
        minutesAway: null
    });
    renderTableData();
});

//update times on schedule every nSeconds
function timer(nSeconds){
    var counter = setInterval(function(){
        console.log("timer() called");
        console.log("childArray = ", childArray);
        renderTableData();
    }, nSeconds * 1000);
}

//start timer
timer(30);










})