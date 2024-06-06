console.log('lets write javaDcript');

let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutes(seconds) {

    if(isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Calculate minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs (folder){
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);
    songs = []
    for(let index = 0;index < as.length; index++)
        {
            const element = as[index];
            if(element.href.endsWith(".mp3")){
                songs.push(element.href.split(`/${folder}/`)[1])
            }
        }
        // console.log(songs);
        // return songs



        // Show all the song in the playlist
        let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
        songUl.innerHTML=" "
        for (const song of songs) {
            songUl.innerHTML = songUl.innerHTML + `
            
            <li>
                                <img class="invert" src="music.svg" alt="music">
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                    <div>Sumit Yadav</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg" alt="play">
                                </div> </li> `;
        }
    
        
        // Attach an eventlistner to each song
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                
            })
            
        })

        
        // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach( e=> {
        e.addEventListener("click", async item=> {
            console.log(item, item.currentTarget.dataset.folder);
            
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

    return songs;

}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track) 
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"




}



async function main(){


    ///Get the list of all the songs
    await getSongs("songs/haryanvi")
    // console.log(songs);


    playMusic(songs[0],true)



    // Attach an event listener to play
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        if(currentSong.currentTime == currentSong.duration)
            {
                play.src = "play.svg"
            }
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100
        
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-100%"
    })


    // Add an event listener to previous
    previous.addEventListener("click", ()=> {
        console.log('previous clicked');

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        console.log(index);
        
        if((index - 1) >= 0){
            playMusic(songs[index - 1])
        }
        
    })
    
    // Add an event listener to next
    next.addEventListener("click", ()=> {
        console.log('next clicked');
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        console.log(index);

        if((index + 1) < songs.length){
            playMusic(songs[index + 1])
        }
        
    })

    
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value)/100
        if(currentSong.volume > 0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=> {
        console.log(e.target);
        console.log('changing',e.target.src);
        
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })


}
  
main()
