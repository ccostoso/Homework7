// Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyCbqBU4KwOWLRFDEKqi6i7HRt0QiJUiA_I",
authDomain: "firstproject-4232a.firebaseapp.com",
databaseURL: "https://firstproject-4232a.firebaseio.com",
projectId: "firstproject-4232a",
storageBucket: "firstproject-4232a.appspot.com",
messagingSenderId: "221508126652",
appId: "1:221508126652:web:a1a06ff1dc28dfa2a70db9",
measurementId: "G-6ZBM1BLD1Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Create "database" variable for referencing database
database = firebase.database();
trainRef = database.ref("/trains");

// Create variables for chart
var trainArr = [];

// Find the amount of minutes until next arrival.
function findAway(timeInMin, firstTimeInMin, trainFreq) {
    return (timeInMin >= firstTimeInMin) ? (trainFreq - (timeInMin - firstTimeInMin) % trainFreq) : false;
}

// Find the next arrival
function findNext(hour, min, away, first, timeInMin, firstTimeInMin, trainFreq) {
    if (findAway(timeInMin, firstTimeInMin, trainFreq)) {
        if (min + away > 59) {
            console.log("min + away > 59, train will arrive after end of hour");
            var nextHour = hour + 1;
            console.log("nextHour", nextHour);
            var nextMin = min + away - 60;
            console.log("nextMin", nextMin);
            if (nextMin > 9) {
                var nextTime = `${nextHour}:${nextMin}`;
            } else {
                var nextTime = `${nextHour}:0${nextMin}`;
            };
            console.log("nextTime", nextTime);
            return nextTime;
        } else {
            console.log("min + away <= 59, train will arrive before end of hour");
            if (min + away > 9) {
                var nextTime = `${hour}:${min + away}`;
            } else {
                var nextTime = `${hour}:0${min + away}`;
            };
            console.log("nextTime", nextTime);
            return nextTime;
        }
    } else {
        console.log("Next train is first scheduled train.");
        console.log(first);
        return first;
    }
}

// Get database info
trainRef.on("value", function(snapshot) {
    console.log(snapshot.val());
    
    $("tbody").empty();
    
    if (snapshot.val()) {
        trainArr.push(snapshot.val());
    }
    
    $.each(snapshot.val(), function(i, ele) {
        console.log("ele", ele);
        
        populateDisplays(ele.name, ele.dest, ele.first, ele.freq);
    })
})

function populateDisplays(name, dest, first, freq) {

    // Populate #current-train display with input and calculated values
    var time = new Date();
    var hour = time.getHours();
    console.log("hour", hour);
    var min = time.getMinutes();
    console.log("min", min);
    var timeInMin = (hour * 60) + min;
    console.log("timeInMin", timeInMin);
    
    console.log("first", first);
    var firstHour = parseInt(first.slice(0, 2));
    console.log("firstHour", firstHour);
    var firstMin = parseInt(first.slice(3));
    console.log("firstMin", firstMin);
    var firstTimeInMin = (firstHour * 60) + firstMin;
    console.log("firstTimeInMin", firstTimeInMin);


    console.log("findAway(timeInMin, firstTimeInMin, freq)", findAway(timeInMin, firstTimeInMin, freq))

    var away;

    if (findAway(timeInMin, firstTimeInMin, freq)) {
        away = findAway(timeInMin, firstTimeInMin, freq);
    } else {
        away = firstTimeInMin - timeInMin;
    }
    console.log("away", away);

    var tr = $("<tr>");
    var nameDisplay = $("<td>").attr("scope", "col").text(name);
    var destDisplay = $("<td>").text(dest);
    var freqDisplay = $("<td>").text(freq);
    var nextDisplay = $("<td>").text(findNext(hour, min, away, first, timeInMin, firstTimeInMin, freq));
    console.log("findNext(hour, min, away, timeInMin, firstTimeInMin, freq)", findNext(hour, min, away, first, timeInMin, firstTimeInMin, freq));
    var awayDisplay = $("<td>").text(away);

    tr.append(nameDisplay, destDisplay, freqDisplay, nextDisplay, awayDisplay);
    $("tbody").append(tr);
    console.log("=========");
}

// Pull values from form on click
$("#submit").on("click", function(event) {
    // Prevent refresh on click
    event.preventDefault();

    var train = {};

    train.name = $("#name-input").val().trim();
    train.dest = $("#dest-input").val().trim();
    train.first = $("#first-input").val().trim();
    train.freq = parseInt($("#freq-input").val().trim());
    console.log("train", train)

    trainArr.push(train);
    console.log("trainArr", trainArr);

    // // Push variables to Firebase
    database.ref("/trains").push(train);
})

