// Runtime actions include driving, turning, drifting all use an individual interval that fires every 10ms


//Object that contains ID needed to clear interval, type (turn/drive/drift), and whether it is active or not
class IntervalObj {
    constructor(intervalID, type, active) {
        this.intervalID = intervalID;
        this.type = type
        this.active = active;
    }
}

//All intervals are stored as objects in the following array
var intervalStorage = [];


//Initiates corresponding interval only if no other active intervals of same type exist
function createInterval(typeOfInterval) {
    const foundInt = intervalStorage.some(el => el.active === true && el.type === typeOfInterval);
    var funcToPass;
    switch (typeOfInterval) {
        case 'turn':
            funcToPass = turnWheels;
            break;
        case 'drive':
            funcToPass = drive;
            break;
        case 'drift':
            funcToPass = drift;
            break;
    }
    foundInt ? null : intervalStorage.push(new IntervalObj(setInterval(funcToPass, 10), typeOfInterval, true));
}

//Clears all intervals of specified type
function clearIntervals(typeOfInterval) {
    for (var i = 0; i < intervalStorage.length; i++) {
        if (intervalStorage[i].type == typeOfInterval) {
            clearInterval(intervalStorage[i].intervalID);
            intervalStorage[i].active = false;
        }
    }
}
//(create function will only ever create 1 of each type, but clear function clears all of specified type as a failsafe)
