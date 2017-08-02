// Initialize Firebase
var config = {
  apiKey: "AIzaSyD9Vm4pg83gODS6YUa3aaSmdYqQ9ghgVMg",
  authDomain: "trainschedule-d56ca.firebaseapp.com",
  databaseURL: "https://trainschedule-d56ca.firebaseio.com",
  projectId: "trainschedule-d56ca",
  storageBucket: "",
  messagingSenderId: "880157493300"
};
firebase.initializeApp(config);

// Variables
// ================================================================================

// Get a reference to the database service
var database = firebase.database();
var trainName = "";
var trainDestination = "";
var trainFirstTime = "";
var trainFrequency = 0;
var nextArrival;


//to get next arrival take first train time and frequency

// Whenever a user clicks the click button
$("#submitBtn").on("click", function() {
  // Don't refresh the page!
  event.preventDefault();

  //grab user input
  trainName = $("#trainName").val().trim();
  trainDestination = $("#destination").val().trim();
  trainFirstTime = $("#firstTime").val().trim()
  trainFirstTimeConverted = moment($("#firstTime").val().trim(), "HH:mm").subtract(1, "years");
  trainFrequency = $("#frequency").val().trim();

  // Test for variables entered
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirstTime);
  console.log(trainFrequency);


  var trainInfo = {
    name: trainName,
    destination: trainDestination,
    start: trainFirstTime,
    frequency: trainFrequency
  }

  // Code for handling the push to database
  database.ref().push({
    trainInfo
  });

  //clear input boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");

  //prevent refresh of page
  return false;
});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function(childsnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childsnapshot.val().trainInfo);
  //console.log(snapshot.val().trainInfo);

  //firebase variables assigned to snapshot
  var fName = childsnapshot.val().trainInfo.name;
  var fDestination = childsnapshot.val().trainInfo.destination;
  var fTrainTime = (parseInt(childsnapshot.val().trainInfo.start));
  console.log(fTrainTime);
  var fFrequency = childsnapshot.val().trainInfo.frequency;
  

  var diffTime = moment().diff(moment(fTrainTime), "minutes");
  console.log(diffTime);
  var timeRemainder = diffTime % fFrequency;
  var minutesTill = fFrequency - timeRemainder;
// grab current time to figure out when the next train will come
  var currentTime =moment ();

  var nextTrain = moment().add(minutesTill, "minutes").format("hh:mm A");


  //append train info  

  $("#trainInput > tbody").append("<tr><td>" + fName + "</td><td>" +
    fDestination + "</td><td>" +
    fFrequency + " mins" + "</td><td>" +
    nextTrain + "</td><td>" +
    minutesTill + "</td></tr>");

});