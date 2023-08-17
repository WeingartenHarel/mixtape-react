import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { youTubeService } from "../../services/youTubeService.js";
import { mixService } from "../../services/mixService.js";
import { setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew } from '../../store/slices/mixSlice'
import Search from '../../Assets/search.svg'
import Unmute from '../../Assets/unmute.svg'
import Add from '../../Assets/add.svg'
import Close from '../../Assets/close.svg'

function ApiSearch({ currentMix }) {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');
    const { loggedInUser } = useSelector((state) => state.user);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearchResults, setIsSearchResults] = useState(false);
    const [createNewSong, setCreateNewSong] = useState(mixService.createNewSong());
    const [currMix, setCurrMix] = useState(null);
    const [song, setSong] = useState([{
        id: {
            videoId: 'D2heCoIKa1U'
        },
        snippet: {
            thumbnails: {
                default: {
                    url: "https://res.cloudinary.com/hw-projects/image/upload/v1636201881/appmixes/1024px-simple_music-svg_k1ce0w.png"
                }
            },
            title: "Natanael Cano x Ovi x Snoop Dogg x Snow Tha Product x CNG - Feeling Good [Official Video]"
        }
    }]);
    const [mixId, setMixId] = useState(null);

    const handleSearchResults = async () => {
        if (keyword === '') return;
        const res = await youTubeService.query(keyword);
        setSearchResults(res);
        setIsSearchResults(true)
    };

    const addSongToMix = (result) => {
        // return {
        //     "title": '',
        //     "id": makeId(),
        //     "songUrlId": '',
        //     "imgUrl": '',
        //     "addedBy": "minimal-user",
        //     "duration": "3:21",
        //     "isPlaying":false
        // }
        let mixCopy = JSON.parse(JSON.stringify(currentMix));
        let newSong = mixService.createNewSong()
        console.log('result',result)
        newSong.title = result.title;
        newSong.songUrlId = result.songId;
        newSong.addedBy = loggedInUser ? loggedInUser.fullname : "minimal-user";
        newSong.imgUrl = result.thumbnails.default.url;
        newSong.duration = result.duration;
        mixCopy.songs.push(newSong);

        handleSaveChange(mixCopy)
    };

    const handleChange = (e) => {
        const value = e.target.value
        setKeyword(value)
    };

    const handleSaveChange = async (mix) => {
        // update mix
        dispatch(updateMix(mix))
    };

    const closeSearchResults = async (mix) => {
        // update mix
        setIsSearchResults(false)
    };

    return (
        <section>
            <div className="search-api">
                <form onSubmit={(event) => { event.preventDefault(); handleSearchResults(); }}>
                </form>
                <input
                    type="text"
                    placeholder="Search songs from youtube..."
                    value={keyword.inputsearch}
                    name="inputsearch"
                    onChange={handleChange}
                />
                <i className="icon" onClick={handleSearchResults}>
                    <img src={Search} />
                </i>
            </div>
            {searchResults && isSearchResults && <div className="searchResults" style={searchResults ? {} : { display: 'none' }}>
                <ul>
                    {searchResults && isSearchResults && searchResults.map((result) => (
                        <li key={result.songId}>
                            <div className="info">
                                <img className='image-song' src={result.thumbnails.default.url} alt="" />
                                <p>{result.title}</p>
                            </div>
                            <button onClick={(event) => { event.preventDefault(); addSongToMix(result); }}>
                                <i className="icon">
                                    <img src={Add} />
                                </i>
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={(event) => { event.preventDefault(); closeSearchResults(); }}>
                    <i className="icon">
                        <img src={Close} />
                    </i>
                </button>
            </div>}
        </section>
    );
}

export default ApiSearch;
