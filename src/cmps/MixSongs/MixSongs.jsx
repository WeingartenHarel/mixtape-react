import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/socket';
import { setCurrentSong } from '../../store/slices/mixSlice'
import ListDrag from '../ListDrag/ListDrag'
import ApiSearch from '../ApiSearch/ApiSearch'
import { setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew, updateCurrentMix, saveUpdateMix } from '../../store/slices/mixSlice'
import Search from '../../Assets/search.svg'

const MixSongs = ({ currentMix }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [mixSongsData, setMixSongsData] = useState();
  const [mixSongsDataFiltered, setMixSongsDataFiltered] = useState(null);
  const [songTxt, setSongTxt] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const { currSong } = useSelector(state => state.mixs);

  useEffect(() => {
    socket.current.on('play-song', song => {
      dispatch(setCurrentSong(song))
    })

    socket.current.on('pause-song', currSong => {
      currSong.isPlaying = false
      dispatch(setCurrentSong(currSong))
    })

    socket.current.on('mix-is-updated', mix => {
      dispatch(saveUpdateMix(mix));
    });

    return () => {
      // Cleanup code here
    };
  }, []);

  useEffect(() => {
    if (!currentMix) return
    const mixCopy = JSON.parse(JSON.stringify(currentMix));
    let songsFiltered = []
    songsFiltered = mixCopy.songs.filter((song) => {
      return song.title.toLowerCase().includes(songTxt.toLowerCase());
    });
    setMixSongsDataFiltered(songsFiltered)
  }, [songTxt, currentMix]);

  const handlePlaySong = (song, index) => {
    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    currentMixCopy.songs.forEach(song => song.isPlaying = false);
    currentMixCopy.songs[index].isPlaying = true;
    saveUpdateMixAndEmit(currentMixCopy)
    // dispatch(updateMix(currentMixCopy))

    let songCopy = { ...song }
    songCopy.isPlaying = true
    dispatch(setCurrentSong(songCopy))
    socket.current.emit('set-song-playing', songCopy);
  }

  const handlePauseSong = (song, index) => {

    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    let currentSongsCopy = JSON.parse(JSON.stringify(currentMix.songs));
    let currentSongsCopyReset = currentSongsCopy.map(song => {
      return {
        ...song,
        isPlaying: false
      }
    })
    currentMixCopy.songs = currentSongsCopyReset
    currentMixCopy.songs[index].isPlaying = false;
    saveUpdateMixAndEmit(currentMixCopy)

    let songCopy = { ...song }
    songCopy.isPlaying = false
    socket.current.emit('pause-song-playing', songCopy);
    dispatch(setCurrentSong(songCopy))
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

  const startSongPlaying = (song, mix) => {
    // Dispatch action to start playing the song
    // Example: dispatch({ type: 'START_SONG_PLAYING', song, mix });
  };

  const setCurrSongPlaying = (song) => {
    // Dispatch action to set the current song playing
    // Example: dispatch({ type: 'SET_CURR_SONG_PLAYING', song });
  };

  const pauseSong = (song) => {
    // Dispatch action to pause the song
    // Example: dispatch({ type: 'PAUSE_SONG', song });
  };

  const emitSongPos = (index, move) => {
    // Dispatch action to move the song to a new position in the list
    // Example: dispatch({ type: 'MOVE_SONG_POSITION', index, move });
  };

  const emitSongId = (songId) => {
    // Dispatch action to delete the song from the list
    // Example: dispatch({ type: 'DELETE_SONG', songId });
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
