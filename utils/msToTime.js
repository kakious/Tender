module.exports = duration => {
    var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    if (hours == '00') {
        time = minutes + ":" + seconds;
    } else if (minutes == '00') {
        time = seconds +  ' seconds';
    } else {
        time = hours + ":" + minutes + ":" + seconds;
    }
    return time;
}