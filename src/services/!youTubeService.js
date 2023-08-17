// Import the Google API client library
// import { google } from 'googleapis';
import axios from 'axios';

export const youTubeService = {
    query
}
 
const URL = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_API_KEY = 'AIzaSyDMqx0m8tzNht1u0x_mzgjIZcsKU2ojh4E'
// Create a YouTube Data API client
// const youtube = google.youtube({
//     version: 'v3',
//     auth: 'YOUR_API_KEY', // Replace with your actual API key
// });

// Define the search parameters
// const searchParams = {
//     part: 'snippet',
//     q: 'your search keyword',
//     type: 'video',
//     maxResults: 10,
// };
// https://www.googleapis.com/youtube/v3/videos.
// https://www.googleapis.com/youtube/v3/vidoes.


// https://www.googleapis.com/youtube/v3/search?key=AIzaSyDMqx0m8tzNht1u0x_mzgjIZcsKU2ojh4E&maxResults=3&safeSearch=strict&type=video&q=metalica
// Perform the search using the YouTube Data API
function query(searchParams) {
    try {
        axios.get(`${URL}?key=${YOUTUBE_API_KEY}&maxResults=3&safeSearch=strict&type=video&q=metalica`, {
          headers: {
            'withCredentials': false,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Origin': 'https://www.googleapis.com',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          }
        })
        .then((response) => {
        });

        // const result = axios.get(`, headers: {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        // },)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}
