const keys = document.querySelector(".buttons")
const timeDiv = document.querySelector(".time")
const playButton = document.querySelector(".play")
const circle = document.querySelector('.pr-ring-circle')

const cir = 2*158*Math.PI;

circle.style.strokeDasharray = `${cir} ${cir}`;
circle.style.strokeDashoffset = `${cir}`;

var stopwatchInterval;
var elapsedPausedTime = 0;
going = false

keys.addEventListener("click", e => {
    if(e.target.matches("button")){
        const key = e.target
        const action = key.dataset.action
        const mode = key.dataset.mode
        if(action === "play"){
            //here is where we actually do timer shit.
            if(!going && mode==='timer' && timeDiv.textContent!=='00:00:00'){ //hit play
                //play
                setProgress(-100)
                going = true
                var givenTime = timeDiv.textContent
                var timeArray = givenTime.split(':')
                var min = parseInt(timeArray[1])
                var hour = parseInt(timeArray[0])
                var sec = parseInt(timeArray[2])
                var ms = (1000*sec) + (1000*60*min) + (1000*60*60*hour)
                if(ms >= 1000){
                    var nowAsMs = parseInt(Date.now()) +1000
                    var countMs = nowAsMs + ms
                    var totaldist = countMs-nowAsMs
                    x = setInterval(function() {
                        var now = parseInt(Date.now())
                        var distance = countMs - now
                        setProgress(-((distance-1000)/totaldist*100))
                        var newHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var newMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var newSeconds = Math.floor((distance % (1000 * 60)) / 1000);
                        var newTime = (pad(newHours) + ":" + pad(newMinutes) + ":" + pad(newSeconds))
                        timeDiv.textContent = newTime
                        if(distance<1000){
                            clearInterval(x)
                            //alarm
                            var audio = new Audio('alarm.mp3')
                            audio.play();
                            going = false
                            circle.style.strokeDasharray = `${cir} ${cir}`;
                            circle.style.strokeDashoffset = `${cir}`;
                        }
                    }, 1000);
                }
                
            }
            if(mode==='stop'){
                if(key.innerHTML !== '<i class="material-icons">pause</i>'){ //hit play
                    key.innerHTML = '<i class="material-icons">pause</i>'
                    //play
                    startStopwatch()
                } else {
                    key.innerHTML = '<i class="material-icons">play_arrow</i>'//hit pause
                    //pause
                    stopStopwatch()
                }
            }
        }
        if(action === "reset"){
            if(mode==='timer'){
                timeDiv.textContent = '00:00:00'
                if(going){
                    clearInterval(x)
                    going = false
                }
                circle.style.strokeDasharray = `${cir} ${cir}`;
                circle.style.strokeDashoffset = `${cir}`;
            }
            if(mode==='stop'){
                resetStopwatch()
            }
        }
    }
})

function startStopwatch() {
    if (!stopwatchInterval){
        startTime = new Date().getTime() - elapsedPausedTime;
        stopwatchInterval = setInterval(updateStopwatch, 1000);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    elapsedPausedTime = new Date().getTime() - startTime;
    stopwatchInterval = null;
}

function resetStopwatch(){
    stopStopwatch();
    elapsedPausedTime = 0;
    timeDiv.textContent = "00:00:00"
    playButton.innerHTML = '<i class="material-icons">play_arrow</i>'
}

function updateStopwatch() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime
    var seconds = Math.floor(elapsedTime / 1000) % 60
    var minutes = Math.floor(elapsedTime /1000/60)%60
    var hours = Math.floor(elapsedTime /1000/60/60)
    var displayTime = pad(hours) + ':' + pad(minutes) + ":" + pad(seconds)
    timeDiv.textContent = displayTime
}

function setProgress(percent){
    const offset = cir - percent / 100 * cir;
    circle.style.strokeDashoffset = offset
}

function pad(number) {
    return (number <10 ? "0" : "") + number
}

//todo:
/*
- add ring in timer
*/