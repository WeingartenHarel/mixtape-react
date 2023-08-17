import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SocketContext } from '../../context/socket';

import { Link } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import { utilService } from "../../services/utilService.js";

import Prev from '../../Assets/prev.svg'
import Next from '../../Assets/next.svg'
import Play from '../../Assets/play.svg'
import Pause from '../../Assets/pause.svg'
import Mute from '../../Assets/mute.svg'
import Unmute from '../../Assets/unmute.svg'

import { setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew, setCurrentSong, setPrevSongNotPlaying, saveUpdateMix } from '../../store/slices/mixSlice'

const Player = () => {
  const youtubeRef = useRef(null);
  const dispatch = useDispatch()
  const socket = useContext(SocketContext);

  const { currentMix } = useSelector((state) => state.mixs);
  const { currSong } = useSelector(state => state.mixs);
  const [playerEvent, setPlayerEvent] = useState(null);
  const [songUrl, setSontUrl] = useState(null);

  const [currTime, setCurrTime] = useState(0);
  const [currTimeToDisplay, setCurrTimeToDisplay] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalTimeToDisplay, setTotalTimeToDisplay] = useState(0);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);


  const playerStateChange = (e) => {
  }

  useEffect(() => {
    if (!currSong) return
    setSontUrl(currSong.songUrlId);
    setTotalTimeToDisplay(currSong.duration)
  }, [currSong]);

  useEffect(() => {
    if (!currSong || !playerEvent) return

    const intervalId = setInterval(() => {
      let currentTimeResult = Math.floor(playerEvent.target.getCurrentTime());
      setCurrTime(currentTimeResult)

      let currentTimeToSecResult = utilService.convertSecondsToTime(
        Math.floor(playerEvent.target.getCurrentTime())
      );
      setCurrTimeToDisplay(currentTimeToSecResult);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currSong, playerEvent]);

  const play = () => {
    const index = currentMix.songs.findIndex((item) => item.id === currSong.id);
    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    let currentSongsCopy = JSON.parse(JSON.stringify(currentMix.songs));
    let currentSongsCopyReset = currentSongsCopy.map(song => {
      return {
        ...song,
        isPlaying: false
      }
    })

    currentMixCopy.songs = currentSongsCopyReset
    currentMixCopy.songs[index].isPlaying = true;
    saveUpdateMixAndEmit(currentMixCopy);

    let songCopy = { ...currSong }
    songCopy.isPlaying = true

    socket.current.emit('set-song-playing', songCopy);
    dispatch(setCurrentSong(songCopy))

  };

  const handlePauseSong = () => {
    const index = currentMix.songs.findIndex((item) => item.id === currSong.id);
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
    // dispatch(updateMix(currentMixCopy))

    let songCopy = { ...currSong }
    songCopy.isPlaying = false
    socket.current.emit('pause-song-playing', songCopy);
    dispatch(setCurrentSong(songCopy))
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

    // let nextSongId = nextSong.songUrlId;
    // setSontUrl(nextSongId)

    let songCopy = { ...nextSong }
    songCopy.isPlaying = true
    dispatch(setCurrentSong(songCopy))

    let updatedMix = JSON.parse(JSON.stringify(currentMix));
    updatedMix.songs[idx].isPlaying = false;
    updatedMix.songs[nextSongIdx].isPlaying = true;

    saveUpdateMixAndEmit(updatedMix)
    socket.current.emit('next-song', nextSong)
  }

  const onNextSong = () => {
    autoPlayNextSong()
  }

  const saveUpdateMixAndEmit = (mix) => {
    dispatch(saveUpdateMix(mix));
    socket.current.emit('mix-updated', mix);
  }

  const _onReady = (eventPlayer) => {
    if (!currSong) return
    setPlayerEvent(eventPlayer)
    setTotalTime(eventPlayer.target.getDuration());

    if (currSong.isPlaying) eventPlayer.target.playVideo();
    if (currSong.isPlaying === false) eventPlayer.target.pauseVideo();

    socket.current.on('song-time', currTimePlaying => {
      eventPlayer.target.seekTo(currTimePlaying, true);
    })

    socket.current.on("pause-song", () => {
      eventPlayer.target.pauseVideo();
    });
    socket.current.on("play-song", () => {
      eventPlayer.target.playVideo();
    });

  }

  const onInputChange = async (event) => {
    const time = event.target.value
    await playerEvent.target.seekTo(event.target.value, true);
    socket.current.emit('move-to', time);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      origin: window.location.origin,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      allowfullscreen: 1,
      frameBorder: 0,
      autohide: 1,
      // origin: 'http://localhost:3000',
      // origin: 'https://www.youtube.com'
    }
  };

  const changeVolume = (e) => {
    if (!playerEvent) return
    let volumeValue = e.target.value
    playerEvent.target.setVolume(volumeValue)
    setVolume(volumeValue)
  }

  const mute = () => {
    // this.isMuted = true;
    playerEvent.target.mute();
  }

  const unmute = () => {
    playerEvent.target.unMute();
  }

  return (
    <section className="globalPlayer">
      <div className="global-player">

        <div className='section-up'>
          <div className={currSong && currSong.isPlaying ? 'logo-playing' : 'logo-stop'}>
            <Link to="/">
              <img
                className="reflect"
                src="https://res.cloudinary.com/hw-projects/image/upload/v1606479695/appmixes/logo_r_animated_v3_first_Frame"
              />
            </Link>
          </div>
          <div className="title-width">
            <h2>{currSong ? currSong.title : 'Unknown Song'}</h2>
          </div>
        </div>

        <div className='section-down'>
          <div className="progress-bar">
            {currTimeToDisplay ? <p>{currTimeToDisplay}</p> : <p>00:00</p>}
            <input onChange={onInputChange} type="range" min={'0'} max={totalTime} value={currTime} />
            {totalTimeToDisplay ? <p>{totalTimeToDisplay}</p> : <p>00:00</p>}
          </div>
          <div className="step-btn">
            <button onClick={onPrevSong}>
              <img src={Prev} />
            </button>

            {currSong?.isPlaying ? <button onClick={handlePauseSong}>
              <img src={Pause} />
            </button>:
            <button onClick={play}>
              <img src={Play} />
            </button> }
            <button onClick={onNextSong}>
              <img src={Next} />
            </button>
          </div>
          <div className="mute">
            <button onClick={mute}>
              <img src={Mute} />
            </button>
            <div className="player-volume">
              <input type="range" min="0" max="100" value={volume} onChange={changeVolume} />
              {volume ? <p>{volume}</p> :
                <p>50</p>}
            </div>
            <button onClick={unmute}>
              <img src={Unmute} />
            </button>
          </div>
          {/* picture-in-picture */}
          {
            songUrl && <YouTube ref={youtubeRef} videoId={songUrl} onStateChange={playerStateChange}
              opts={opts} onReady={_onReady} onEnd={autoPlayNextSong} />
          }
        </div>
      </div >

    </section >
  );
};

export default Player;
