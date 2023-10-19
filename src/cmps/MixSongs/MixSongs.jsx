import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/socket';
import { setCurrentSong } from '../../store/slices/mixSlice'
import ListDrag from '../ListDrag/ListDrag'
import ApiSearch from '../ApiSearch/ApiSearch'
import {
  setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew, updateCurrentMix, saveUpdateMix, setCurrentSongPause,
  setCurrentSongPlay
} from '../../store/slices/mixSlice';
import {
  setIsPlaying, setIsMuted
} from '../../store/slices/playerSlice';
import Search from '../../Assets/search.svg'
import Player from '../Player/Player'

const MixSongs = ({ currentMix }) => {
  const dispatch = useDispatch();
  const { isPartyMode } = useSelector(state => state.player);
  const socket = useContext(SocketContext);
  const [mixSongsData, setMixSongsData] = useState();
  const [mixSongsDataFiltered, setMixSongsDataFiltered] = useState(null);
  const [songTxt, setSongTxt] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const { currSong } = useSelector(state => state.mixs);

  useEffect(() => {
    socket.current.on('mix-is-updated', mix => {
      dispatch(saveUpdateMix(mix));
    });
  }, []);

  useEffect(() => {
    if (!currentMix) return
    // console.log('currentMix updated',currentMix)
    const mixCopy = JSON.parse(JSON.stringify(currentMix));
    let songsFiltered = []
    songsFiltered = mixCopy.songs.filter((song) => {
      return song.title.toLowerCase().includes(songTxt.toLowerCase());
    });
    setMixSongsDataFiltered(songsFiltered)
  }, [songTxt, currentMix]);
 
  const handlePlaySong = async (song, index) => {
    dispatch(setIsPlaying(true))
    dispatch(setIsMuted(false))

    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    let currentSongsCopy = JSON.parse(JSON.stringify(currentMix.songs));
    let currentSongsCopyReset = currentSongsCopy.map(songItem => {
      return {
        ...songItem,
        isPlaying: false
      }
    })

    currentMixCopy.songs = currentSongsCopyReset
    currentMixCopy.songs[index].isPlaying = true;
    
    // await saveUpdateMixAndEmit(currentMixCopy);
    await dispatch(updateCurrentMix(currentMixCopy));

    let songCopy = { ...song }
    songCopy.isPlaying = true

    await dispatch(setCurrentSong(songCopy))
    await dispatch(setCurrentSongPlay())
    socket.current.emit('set-song-playing', songCopy);
  };

  const handlePauseSong = async (song, index) => {
    dispatch(setIsPlaying(false))
    dispatch(setIsMuted(true))

    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    let currentSongsCopy = JSON.parse(JSON.stringify(currentMix.songs));
    let currentSongsCopyReset = currentSongsCopy.map(songItem => {
      return {
        ...songItem,
        isPlaying: false
      }
    })

    currentMixCopy.songs = currentSongsCopyReset
    currentMixCopy.songs[index].isPlaying = false;

    // await saveUpdateMixAndEmit(currentMixCopy);
    await dispatch(updateCurrentMix(currentMixCopy));

    let songCopy = { ...song }
    songCopy.isPlaying = false

    await dispatch(setCurrentSong(songCopy))
    await dispatch(setCurrentSongPause())
    socket.current.emit('pause-song-playing', songCopy);
  }

  const saveUpdateMixAndEmit = (mix) => {
    dispatch(saveUpdateMix(mix));
    socket.current.emit('mix-updated', mix);
  }

  const filterBySong = (e) => {
    setSongTxt(e.target.value);
  };

  const openInputApi = () => {
    setIsAdd(true);
  };

  const openInputSearch = () => {
    setIsAdd(false);
  };

  return (
    <div className="songs">
      <section className="songs-list flex column">
        {currentMix && (
          <div className="search-song-and-social-container">
            <div className="search-and-add">

              <i onClick={openInputApi} className="icon">
                {/* Replace with your search-plus icon */}
              </i>
              <i onClick={openInputSearch} className="icon">
                {/* Replace with your search icon */}
              </i>

              <ApiSearch currentMix={currentMix} />

              {isAdd ? (
                <></>
              ) : (
                <div className="search-api">
                  <input
                    type="text"
                    placeholder="Search song in mix..."
                    value={songTxt}
                    onChange={filterBySong}
                  />
                  <i className="icon">
                    <img src={Search} />
                  </i>
                </div>
              )}
            </div>
            {/* Replace with your mix-social component */}
          </div>
        )}
        {mixSongsDataFiltered && mixSongsDataFiltered.length > 0 && <ListDrag
          mixSongsDataFiltered={mixSongsDataFiltered}
          handlePlaySong={handlePlaySong} handlePauseSong={handlePauseSong} currentMix={currentMix}
        />}

      </section>
    </div>
  );
};

export default MixSongs;
