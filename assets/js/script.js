$(document).ready(function(){

//initialize firebase

var config = {
    apiKey: "AIzaSyAdAS95wtRFqTOLeOhJV4yWloxjM6UG82I",
    authDomain: "employee-data-managment-8b292.firebaseapp.com",
    databaseURL: "https://employee-data-managment-8b292.firebaseio.com",
    projectId: "employee-data-managment-8b292",
    storageBucket: "",
    messagingSenderId: "30591568901"
};

firebase.initializeApp(config);

var database = firebase.database();

//-----------------------//functions//-----------------------//

$("#submit-button").on("click", function (event) {
    event.preventDefault();

//form values obtained
    var name = $("#name").val().trim();
    var role = $("#role").val().trim();
    var start = $("#start").val();
    var rate = $("#rate").val().trim();

//push values to database
    database.ref().push({
        name: name,
        role: role,
        start: start,
        rate: rate
    });

//clear form
    $("#employee-form").trigger("reset");
})

function renderTableData(sv) {
    var months = (moment().diff(sv.start, 'months', true)).toFixed(2);
    var billed = (months * sv.rate).toFixed(2);
    let newRow = $("<tr>");
    newRow.append($("<td>").text(sv.name));
    newRow.append($("<td>").text(sv.role));
    newRow.append($("<td>").text(months));
    newRow.append($("<td>").text("$" + sv.rate));
    newRow.append($("<td>").text("$" + billed));
    $("#table-body").append(newRow);
}

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();
    renderTableData(sv);

});




})