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
resetDB();

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
    // var now = moment();
    // var minutesSinceFirstTrain = (now.subtract(moment(snapVal.start, "HH:mm"))).format("m");
    // var minutesAway = minutesSinceFirstTrain % snapVal.frequency;
    // var nextArrival = now.add(minutesAway, "m").format("HH:mm");
    // childArray.push({
    //     name: snapVal.name,
    //     destination: snapVal.destination,
    //     start: snapVal.start,
    //     frequency: snapVal.frequency,
    //     nextArrival: nextArrival,
    //     minutesAway: minutesAway
    // });
    $("#table-body").empty();
    childArray.forEach(function(child){
        var key = child.key
        var newRow = $("<tr id='" + key + "'>");
        newRow.append($("<td>").text(child.name));
        newRow.append($("<td>").text(child.destination));
        newRow.append($("<td>").text(child.frequency));
        newRow.append($("<td>").text(child.nextArrival));
        newRow.append($("<td>").text(child.minutesAway));
        newRow.append(makeButton(key));
        $("#table-body").append(newRow);
    });
}

function makeButton(key){
    var deleteButton = $("<button class='btn btn-danger' id='delete-" + key + "'>")
    .text("X")
    .on("click", function(){
        console.log("delete button 'delete-" + key + "' clicked");
        database.ref(key).remove()
        .then(function() {
            console.log("Remove succeeded.")
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
        $("#"+key).remove();
        //$(this).remove();
        childArray.forEach(function(child){
            if(child.includes(key)){
                var index = childArray.indexOf(key);
                childArray.splice(index, 1);
                console.log(childArray[index] + " removed.");
                console.log('childArray = ', childArray);

            }

        });

    });
    return deleteButton;
}


database.ref().on("child_added", function (snapshot) {
    var key = snapshot.key;
    var addedChild = snapshot.val();
    console.log('snapshot.key', snapshot.key)
    console.log("snapshot.val() = ", addedChild);
    for (train in addedChild){
        console.log("prop:", addedChild[train]);
    }
    var now = moment();
    var minutesSinceFirstTrain = (now.subtract(moment(addedChild.start, "HH:mm"))).format("m");
    var minutesAway = minutesSinceFirstTrain % addedChild.frequency;
    var nextArrival = now.add(minutesAway, "m").format("HH:mm");
    childArray.push({
        key: addedChild.key,
        name: addedChild.name,
        destination: addedChild.destination,
        start: addedChild.start,
        frequency: addedChild.frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });
    renderTableData();
});



function updateTableData(){
    console.log('updateTableData() called');
    database.ref().once("value", function(snapshot){
        renderTableData();

    })
}
    // var now = moment();
    // console.log("now", now);        
    // console.log('$("#table-body").children()', $("#table-body").children())
    // var rows = $("#table-body").children().prevObject[0].children;
    // console.log('rows', rows);
    // var f = $(".frequency-col");
    // console.log('f', f);
    // for(row in rows){
        

    // }

    
    // var minutesSinceFirstTrain = (now.subtract(moment(start, "HH:mm"))).format("m");
    // var minutesAway = minutesSinceFirstTrain % frequency;

// }

//updateTableData();









})