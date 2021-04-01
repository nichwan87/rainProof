
//Sets top of page current date and time


const date = new Date();

const today = date.toDateString();

timer();

function timer(){
var currentTime = new Date()
var hours = currentTime.getHours()
var minutes = currentTime.getMinutes()
var sec = currentTime.getSeconds()
if (minutes < 10){
    minutes = "0" + minutes
}
if (sec < 10){
    sec = "0" + sec
}
var t_str = hours + ":" + minutes + ":" + sec + " ";
if(hours > 11){
    t_str += "PM";
} else {
   t_str += "AM";
}
document.getElementById('now').innerHTML = today + ' @ ' + t_str;
 setTimeout(timer,1000);
}

