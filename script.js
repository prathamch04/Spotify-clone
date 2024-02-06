// console.log('Lets write javascript');

let currentSong = new Audio();

let songs;

let currfolder;

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    

    // console.log(songs);


    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = " "
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +
            `<li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class = "invert" src="play.svg" alt="">
        </div>        
        </li>`;

    }



    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        let playNow = e.getElementsByTagName('img')[1];
        playNow.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    

}

const playMusic = (track) => {
    // var audio = new Audio("/songs/" + track);
    currentSong.src = `/${currfolder}/` + track
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration);
    // });

    
}

function secondsToMinutesAndSeconds(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        return "00/00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function displayAlbums(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a')
    Array.from(anchors).forEach(e => {
        // console.log(e.href);
        if(e.href.includes("/songs")){
            console.log(e.href.split("/").slice(-1)[0]);
        }
    })
}


async function main() {

    // get the list of all songs
    await getSongs("songs/JAAT")
    // console.log(songs);

    displayAlbums()
    
    // Attach an event listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })


    //listen for time Update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"


    })


    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    //Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener to close button
    document.querySelector(".close").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listener to previous
    previous.addEventListener("click" , () => {
        console.log("previous click");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index - 1) >= 0){
            playMusic(songs[index - 1])
        }

    })
    
    
    //Add an event listener to next
    next.addEventListener("click" , () => {
        console.log("next click");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(songs, index);
        if((index+1) < songs.length){
            playMusic(songs[index + 1])
        }
       
    })


    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(e =>{
        console.log(e);
       e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })


}

main()





