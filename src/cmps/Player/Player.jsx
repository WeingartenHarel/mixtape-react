import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SocketContext } from '../../context/socket';

import { Link } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import { utilService } from "../../services/utilService.js";
import ReactPlayer from 'react-player/youtube'

import Prev from '../../Assets/prev.svg'
import Next from '../../Assets/next.svg'
import Play from '../../Assets/play.svg'
import Pause from '../../Assets/pause.svg'
import Mute from '../../Assets/mute.svg'
import Unmute from '../../Assets/unmute.svg'

import {
  setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew,
  setCurrentSong, setPrevSongNotPlaying, saveUpdateMix, setCurrentSongPause,
  setCurrentSongPlay,updateCurrentMix
} from '../../store/slices/mixSlice'
import { setIsPlaying, setIsMuted, setIsPartyMode } from '../../store/slices/playerSlice'

const Player = () => {
  // const youtubeRef = useRef(null);
  const dispatch = useDispatch()
  const socket = useContext(SocketContext);

  const { currentMix } = useSelector((state) => state.mixs);
  const { currSong } = useSelector(state => state.mixs);
  const { isPlaying } = useSelector(state => state.player);
  const { isMuted } = useSelector(state => state.player);
  const { isPartyMode } = useSelector(state => state.player);

  const [playerEvent, setPlayerEvent] = useState(null);
  const [songUrl, setSontUrl] = useState(null);
  const [youtubeRef, setYoutubeRef] = useState(null);

  const [currTime, setCurrTime] = useState(0);
  const [currTimeToDisplay, setCurrTimeToDisplay] = useState(0);
  const [totalTimeToDisplay, setTotalTimeToDisplay] = useState(0);

  const [volume, setVolume] = useState(0.5);
  const [volumeDisplay, setVolumeDisplay] = useState(50);
  // const [isPartyMode, setIsPartryMode] = useState(false);
  const [isSeeking, setSeeking] = useState(false);
  const [checkIsPartyMode, setCheckIsPartyMode] = useState(false);

  useEffect(() => {
    if (!socket.current) return
    socket.current.on('song-time', (payload) => {
      setCheckIsPartyMode({ on: 'song-time', payload })
    })
    socket.current.on("play-song", (payload) => {
      setCheckIsPartyMode({ on: 'play-song', payload })

    });
    socket.current.on("pause-song", (payload) => {
      setCheckIsPartyMode({ on: 'pause-song', payload })
    });
  }, [socket.current]);

  useEffect(() => {
    const payload = checkIsPartyMode.payload
    if (!checkIsPartyMode) return
    if (!isPartyMode) return
    switch (checkIsPartyMode.on) {
      case 'song-time':
        onSeek(payload)
        break;
      case 'play-song':
        onPlay(payload)
        break;
      case 'pause-song':
        onStop(payload)
        break;
      default:
        return console.log()
    }
  }, [checkIsPartyMode, isPartyMode]);

  useEffect(() => {
    if (!currSong) return
    setSontUrl(currSong.songUrlId);
    setTotalTimeToDisplay(currSong.duration)

    if (currSong.isPlaying) {
      setIsPlaying(true)
      setIsMuted(false)
    } else {
      setIsPlaying(false)
      setIsMuted(true)
    }
  }, [currSong]);

  useEffect(() => {
    if (!currentMix) return
    const song = currentMix.songs.filter(item => item.isPlaying)[0]
    if (!song) return
    dispatch(setCurrentSong(song))

  }, [currentMix]);

  const onSeek = async (payload) => {
    const {song} = payload
    const {time} = payload

    const index = currentMix.songs.findIndex((item) => item.id === song.id);
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
    await dispatch(updateCurrentMix(currentMixCopy));

    await dispatch(setCurrentSong(song))
    youtubeRef.seekTo(time)
  }

  const onPlay = async (song) => {
    dispatch(setIsPlaying(true))
    dispatch(setIsMuted(false))

    const index = currentMix.songs.findIndex((item) => item.id === song.id);
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
    await dispatch(updateCurrentMix(currentMixCopy));

    await dispatch(setCurrentSong(song))
    await dispatch(setCurrentSongPlay())
  }

  const onStop = async (song) => {
    dispatch(setIsPlaying(false))
    dispatch(setIsMuted(true))

    const index = currentMix.songs.findIndex((item) => item.id === song.id);
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
    await dispatch(updateCurrentMix(currentMixCopy));

    await dispatch(setCurrentSong(song))
    await dispatch(setCurrentSongPause())
  }

  const handleSeekMouseDown = e => {
    setSeeking(true)
  }

  const handleSeekMouseUp = e => {
    setSeeking(false)
  }

  const handleSeekChange = (event) => {
    const time = event.target.value
    youtubeRef.seekTo(parseFloat(time))
    let socketPayload = {
      time: time,
      song: currSong
    }
    socket.current.emit('move-to', socketPayload);
  }

  const handleProgress = (event) => {
    if (isSeeking) return
    setCurrTime(event.played)
    setCurrTimeToDisplay(utilService.convertSecondsToTime(Math.floor(event.playedSeconds)));
    // socket.current.emit('move-to', event.played);
  }

  const ended = () => {
    autoPlayNextSong()
  }

  const handlePlaySong = async () => {
    dispatch(setIsPlaying(true))
    dispatch(setIsMuted(false))

    const index = currentMix.songs.findIndex((item) => item.id === currSong.id);
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
    await dispatch(updateCurrentMix(currentMixCopy));

    let songCopy = { ...currSong }
    songCopy.isPlaying = true

    await dispatch(setCurrentSongPlay())
    // let socketPayload = {
    //   song: songCopy,
    //   isPartyMode: isPartyMode
    // }
    socket.current.emit('set-song-playing', songCopy);
  };

  const handlePauseSong = async () => {
    dispatch(setIsPlaying(false))
    dispatch(setIsMuted(true))

    const index = currentMix.songs.findIndex((item) => item.id === currSong.id);
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
    await dispatch(updateCurrentMix(currentMixCopy));

    let songCopy = { ...currSong }
    songCopy.isPlaying = false

    await dispatch(setCurrentSongPause())
    socket.current.emit('pause-song-playing', songCopy);
  }

  const onPrevSong = () => {
    let nextSong;
    let songId = currSong.songUrlId;
    const idx = currentMix.songs.findIndex(
      (song) => song.songUrlId === songId
    );

    if (idx > 0) {
      nextSong = currentMix.songs[idx - 1];
    } else if (idx === 0) {
      nextSong = currentMix.songs[currentMix.songs.length - 1];
    }
    let nextSongId = nextSong.songUrlId;
    setSontUrl(nextSongId);

    let updatedMix = JSON.parse(JSON.stringify(currentMix));
    updatedMix.songs[idx].isPlaying = false;
    saveUpdateMixAndEmit(updatedMix);

    // send to all rooms users
    socket.current.emit('prev-song', nextSong)
  }

  const autoPlayNextSong = () => {
    let nextSong;
    let nextSongIdx;
    let songId = currSong.songUrlId;
    const idx = currentMix.songs.findIndex(
      (song) => song.songUrlId === songId
    );

    // if last song
    if (idx < currentMix.songs.length - 1) {
      nextSong = currentMix.songs[idx + 1]; // next song
      nextSongIdx = idx + 1
    } else if (idx === currentMix.songs.length - 1) {
      nextSong = currentMix.songs[0];
      nextSongIdx = 0
    }

    let songCopy = { ...nextSong }
    songCopy.isPlaying = true
    dispatch(setCurrentSong(songCopy))

    let updatedMix = JSON.parse(JSON.stringify(currentMix));
    updatedMix.songs[idx].isPlaying = false;
    updatedMix.songs[nextSongIdx].isPlaying = true;

    saveUpdateMixAndEmit(updatedMix)
    let socketPayload = {
      song: nextSong,
      isPartyMode: isPartyMode
    }
    socket.current.emit('next-song', socketPayload)
  }

  const onNextSong = () => {
    autoPlayNextSong()
  }

  const saveUpdateMixAndEmit = (mix) => {
    dispatch(saveUpdateMix(mix));
    socket.current.emit('mix-updated', mix);
  }

  const changeVolume = (e) => {
    let num = Number(e.target.value);
    let volumeValue = num / 100
    setVolumeDisplay(num)
    setVolume(volumeValue)
  }

  const mute = () => {
    dispatch(setIsMuted(true))
  }

  const unmute = () => {
    dispatch(setIsPlaying(true))
    dispatch(setIsMuted(false))
  }

  const handlePartyMode = () => {
    dispatch(setIsPartyMode(!isPartyMode))
  }

  return (
    <section className="globalPlayer">
      {/* Join party mode */}
      <div className="global-player">
        <div className={currSong && currSong.isPlaying ? 'logo-playing' : 'logo-stop'}>
          <Link to="/">
            <img
              className="reflect"
              src="https://res.cloudinary.com/hw-projects/image/upload/v1606479695/appmixes/logo_r_animated_v3_first_Frame"
            />
          </Link>
        </div>

        <div>
          {isPartyMode ? <span className='button' onClick={handlePartyMode}>PartyOn</span> :
            <span className='button' onClick={handlePartyMode}>PartyOff</span>}
        </div>

        <div className='sections-container'>
          <div className='section-up'>
            <div className="title-width">
              <h2>{currSong ? currSong.title : 'Unknown Song'}</h2>
            </div>
          </div>

          <div className='section-down'>
            <div className="progress-bar">
              {currTimeToDisplay ? <p>{currTimeToDisplay}</p> : <p>00:00</p>}
              <input
                type='range' min={0} max={0.999999} step='any'
                value={currTime}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
              {totalTimeToDisplay ? <p>{totalTimeToDisplay}</p> : <p>00:00</p>}
            </div>

            <div className="step-btn">
              <button onClick={onPrevSong}>
                <img src={Prev} />
              </button>

              {isPlaying ? <button onClick={handlePauseSong}>
                <img src={Pause} />
              </button> :
                <button onClick={handlePlaySong}>
                  <img src={Play} />
                </button>}

              <button onClick={onNextSong}>
                <img src={Next} />
              </button>
            </div>

            <div className="mute">
              <button onClick={mute}>
                <img src={Mute} />
              </button>
              <div className="player-volume">
                <input type="range" min={0} max={100} value={volumeDisplay} onChange={changeVolume} />
                <p>{volumeDisplay}</p>
              </div>
              <button onClick={unmute}>
                <img src={Unmute} />
              </button>
            </div>

          </div>
          <>
            <ReactPlayer
              // ref={youtubeRef}
              // ref={(player) => youtubeRef = player}
              ref={(player) => setYoutubeRef(player)}
              url={`https://www.youtube.com/watch?v=${songUrl}`}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 1, autoplay: 1,
                    mute: 0,
                    origin: window.location.origin
                  }
                },
              }}
              playing={isPlaying}
              muted={isMuted}
              className='react-player'
              width='0px'
              height='0px'
              volume={volume}
              onSeek={e => onSeek(e)}
              onProgress={(event) => handleProgress(event)}
              onEnded={ended}
              onError={e => console.log('onError', e)}
            // onDuration={handleSeekChange}
            // pip={pip}
            // controls={controls}
            // light={light}
            // loop={loop}
            // playbackRate={playbackRate}
            // onReady={() => console.log('onReady')}
            // onStart={() => console.log('onStart')}
            // onPlay={this.handlePlay}
            // onEnablePIP={this.handleEnablePIP}
            // onDisablePIP={this.handleDisablePIP}
            // onPause={this.handlePause}
            // onBuffer={() => console.log('onBuffer')}
            // onPlaybackRateChange={this.handleOnPlaybackRateChange}
            // onPlaybackQualityChange={e => console.log('onPlaybackQualityChange', e)}
            /></>
          {songUrl && isPlaying && <></>}
        </div>
      </div >

    </section >
  );
};

export default Player;
