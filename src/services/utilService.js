

 
export const utilService = {
    convertSecondsToTime
}


function convertSecondsToTime(seconds) {
    var minutes = 0, hours = 0;
    if (seconds / 60 > 0) {
        minutes = parseInt(seconds / 60, 10);
        seconds = seconds % 60;
    }
    if (minutes / 60 > 0) {
        hours = parseInt(minutes / 60, 10);
        minutes = minutes % 60;
    }
    return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
}