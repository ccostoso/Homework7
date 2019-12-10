function findNext(hour, min, away) {
    if (findAway(timeInMin, firstTimeInMin, train.freq)) {
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
        console.log(train.first);
        return train.first;
    }
}

function findAway(timeInMin, firstTimeInMin, trainFreq) {
    return (timeInMin >= firstTimeInMin) ? (trainFreq - (timeInMin - firstTimeInMin) % trainFreq) : false;
}

module.exports = {
    findNext,
    findAway
}