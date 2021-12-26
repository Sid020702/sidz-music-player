const completed = document.getElementById('completed');
const playButton = document.getElementById('play')
const timeBar = document.getElementById('time-bar')
const play = document.getElementById('play')
const previous = document.getElementById('previous')
const next = document.getElementById('next')
const playPause = document.getElementsByClassName('play-pause')
let isSameSong = null;
let previousSong = null;
completed.style.animationPlayState = 'paused'
const songs = document.getElementsByClassName('audio')
const songName = document.getElementsByClassName('songName')
const songNameDisplay = document.getElementById('songNameDisplay')
const bars = document.getElementsByClassName('bar')
const timeStamp = document.getElementById('time-stamp')
let currentSong = null;
let initialPlay = true
let seconds = 0;
let minutes = 0;
let id = 0;
let stopTime = true;
for (var bar of bars) {
    bar.style.animationPlayState = 'paused'
}

const startTimer = () => {
    if (!stopTime) {
        seconds += 1;
        if (seconds == 60) {
            seconds = 0
            minutes += 1;
        }
        if (seconds > 9) {
            timeStamp.innerHTML = `0${minutes}:${seconds}`
        }
        else {
            timeStamp.innerHTML = `0${minutes}:0${seconds}`
        }



    }

    setTimeout(startTimer, 1000);
}

const stopTimer = () => {
    stopTime = true;
}




playButton.addEventListener('click', () => {
    const running = completed.style.animationPlayState === 'running'
    play.innerHTML = running ? '&#x23f5' : '&#x23f8'

    if (currentSong) {
        stopTimer();
        time = songs[id].currentTime
        for (bar of bars) {
            bar.style.animationPlayState = 'paused'
        }
        songs[currentSong.id].pause();
        currentSong.innerHTML = running ? '&#9658' : '&#x23f8'
        isSameSong = currentSong

        currentSong = null;
    }

    else {

        for (bar of bars) {
            bar.style.animationPlayState = 'running'
        }

        if (initialPlay) {
            stopTime = false;
            setTimeout(startTimer, 1000);
            currentSong = document.getElementById(0);
            songs[id].play()
            songNameDisplay.innerHTML = songName[id].innerHTML
            changeAnimation(songs[id].duration, 0)
            duration = songs[id].duration
            initialPlay = false
            currentSong.innerHTML = '&#x23f8'
        }
        else {
            stopTime = false;
            isSameSong.innerHTML = running ? '&#9658' : '&#x23f8'
            currentSong = isSameSong;
            songs[currentSong.id].play()
        }

    }
    completed.style.animationPlayState = running ? 'paused' : 'running'

})

const changeAnimation = (payload1, payload2) => {

    completed.classList.remove('completed')
    document.documentElement.style.setProperty('--time', `${payload1}s`)
    document.documentElement.style.setProperty('--start-width', `${payload2}%`)
    void completed.offsetWidth;
    completed.classList.add('completed')
}

const changeTimer = (time) => {
    minutes = Math.trunc(time / 60);
    seconds = (Math.trunc(time)) - (60 * minutes);
    if (seconds > 9) {
        timeStamp.innerHTML = `0${minutes}:${seconds}`
    }
    else {
        timeStamp.innerHTML = `0${minutes}:0${seconds}`
    }
}



timeBar.addEventListener('click', (event) => {
    const length = event.clientX - (window.innerWidth / 8);
    if (currentSong) {
        let time = songs[currentSong.id].duration / (0.75 * window.innerWidth)
        songs[currentSong.id].currentTime = time * length
        changeTimer(time * length);
        changeAnimation((0.75 * window.innerWidth - length) * time, length * 100 / (0.75 * window.innerWidth))
    }
    else {
        let time = songs[isSameSong.id].duration / (0.75 * window.innerWidth)
        songs[isSameSong.id].currentTime = time * length;
        changeTimer(time * length);
        changeAnimation((0.75 * window.innerWidth - length) * time, length * 100 / (0.75 * window.innerWidth))
    }

})

previous.addEventListener('click', () => {
    if (currentSong) {
        if (songs[currentSong.id].currentTime < 5) {
            if (id == 0) {
                id = songs.length - 1
            }
            else {
                id--;
            }
            document.getElementById(id).click();
        }

        else {
            songs[id].currentTime = 0;
            changeAnimation(songs[id].duration, 0);
            seconds = 0;
            minutes = 0;
            timeStamp.innerHTML = "00:00"
        }

    }
    else {
        if (songs[isSameSong.id].currentTime < 5) {
            if (id == 0) {
                id = songs.length - 1
            }
            else {
                id--;
            }
            document.getElementById(id).click();
        }

        else {

            songs[id].currentTime = 0;
            changeAnimation(songs[id].duration, 0);
            seconds = 0;
            minutes = 0;
            timeStamp.innerHTML = "00:00"
        }


    }



})


const toggleTimebar = () => {

    if (currentSong) {
        play.innerHTML = '&#x23f8'
        if (previousSong) {
            changeAnimation(120, 0)
        }

        else {

            if (currentSong !== isSameSong) {
                changeAnimation(120, 0)
            }
        }

        completed.style.animationPlayState = 'running'


    }

    else {
        completed.style.animationPlayState = 'paused'
        play.innerHTML = '&#x23f5'

        isSameSong = previousSong;
    }



}

for (var song of playPause) {

    song.addEventListener('click', (event) => {
        if (initialPlay) {
            setTimeout(startTimer, 1000);
            initialPlay = false
        }
        const song = event.target
        previousSong = currentSong
        if (song === currentSong) {
            for (bar of bars) {
                bar.style.animationPlayState = 'paused'
            }
            stopTimer();
            songs[currentSong.id].pause();
            isSameSong = currentSong
            currentSong = null
        }
        else {
            seconds = 0;
            minutes = 0;
            timeStamp.innerHTML = '00:00'
            stopTime = false
            for (bar of bars) {
                bar.style.animationPlayState = 'running'
            }
            currentSong = song
            id = currentSong.id
            songNameDisplay.innerHTML = songName[id].innerHTML
            if (isSameSong) {
                songs[isSameSong.id].currentTime = 0;
                isSameSong = null;
            }
            songs[id].play();
        }

        if (previousSong) {
            songs[previousSong.id].currentTime = 0
            songs[previousSong.id].pause();
            previousSong.innerHTML = '&#9658'

        }

        if (currentSong) {
            currentSong.innerHTML = '&#x23f8'
        }

        toggleTimebar();


    })
}



next.addEventListener('click', () => {
    if (id == songs.length - 1) {
        id = 0
    }
    else {
        id++;
    }
    document.getElementById(id).click();


})

timeBar.addEventListener('animationend', () => {
    seconds = 0;
    minutes = 0;
    timeStamp.innerHTML = '00:00'
    id++;
    songNameDisplay.innerHTML = songName[id].innerHTML
    previousSong = currentSong
    currentSong = document.getElementById(id);
    previousSong.innerHTML = '&#9658'
    currentSong.innerHTML = '&#x23f8'
    songs[currentSong.id].play();
    changeAnimation(songs[currentSong.id].duration, 0);
})

