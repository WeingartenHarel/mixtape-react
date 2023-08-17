
import axios from 'axios';

const API_KEY = 'AIzaSyDMqx0m8tzNht1u0x_mzgjIZcsKU2ojh4E'

export const youTubeService = {
    query,
}

async function query(keyword){
    let res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?maxResults=1&q=${keyword}&key=${API_KEY}&type=video`);
    let songId = res.data.items[0].id.videoId
    // https://www.googleapis.com/youtube/v3/videos?id=M7FIvfx5J10&part=snippet%2Cstatistics%2CcontentDetails&key={Your_key}
    // let songDetails = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?maxResults=1&part=snippet&&id=${songId}&key=${API_KEY}`);
    let songDetails = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?maxResults=1&part=snippet%2CcontentDetails&&id=${songId}&key=${API_KEY}`);
    songDetails.data.items[0].snippet.songId = songId;
    const resultSong = {...songDetails.data.items[0].snippet, ...songDetails.data.items[0].contentDetails}
    resultSong.duration =iso8601DurationToMinutesSeconds(resultSong.duration)
    // return songDetails.data.items[0].snippet;
    return [resultSong];
}

function iso8601DurationToMinutesSeconds(duration) {
    const pattern = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(pattern);
  
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    const seconds = parseInt(matches[3]) || 0;
    
    const minutesConverted =  hours * 60 + minutes;
    const secondsConverted=  seconds;

    const result = minutesConverted + ':' +secondsConverted

    return result
  }



// query('snoop')
// async function query(keyword){
//     // const songsResults;
//     var res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?maxResults=2&&type=video&q=${keyword}&key=${API_KEY}`);
//     // var songs = res.data.items.id.videoId;
//     var songs = res.data.items.map(song => song.id.videoId);
//     // var songsPrm = Promise.all(songs);

    
//     var songsPrm = songs.map(songId => {
//         return axios.get(`https://youtube.googleapis.com/youtube/v3/search?maxResults=2&q=${songId}&key=${API_KEY}`)
//     })
//     var results = Promise.all(songsPrm).then(res => {
//         return res.data;
//     }).then(res => {
//         console.log(res);
//     })
// }