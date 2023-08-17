import React, { useState, useEffect , useContext } from 'react';
import { SocketContext } from '../../context/socket';
import ReactDragListView from 'react-drag-listview/lib/index.js';
import { setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew , saveUpdateMix } from '../../store/slices/mixSlice'
import { useSelector, useDispatch } from 'react-redux';
import Play from '../../Assets/play.svg'
import Pause from '../../Assets/pause.svg'
import UpDown from '../../Assets/updown.svg'
// import Trash from '../../Assets/trash.svg'
import { ReactComponent as Trash } from '../../Assets/trash.svg' // Update the path to your SVG file

function ListDrag({ mixSongsDataFiltered, handlePlaySong, handlePauseSong, currentMix }) {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [data, setData] = useState([...mixSongsDataFiltered]);

    useEffect(() => {
        setData([...mixSongsDataFiltered])
    }, [mixSongsDataFiltered]);

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const newData = [...data];
            const item = newData.splice(fromIndex, 1)[0];
            newData.splice(toIndex, 0, item);
            setData(newData);
            const currentMixCopy = { ...currentMix, songs: newData }
            saveUpdateMixAndEmit(currentMixCopy)
        },
        nodeSelector: 'li',
        handleSelector: '.drag-song'
    };

    const handleSongRemove = async (song) => {
        let mixCopy = JSON.parse(JSON.stringify(currentMix));
        const songsFiltered = mixCopy.songs.filter(item => item.id !== song.id)
        mixCopy.songs = songsFiltered;
        saveUpdateMixAndEmit(mixCopy)
    };

    // const handleSaveChange = async (mix) => {
    //     dispatch(saveUpdateMixAndEmit(mix));
    // };

    const saveUpdateMixAndEmit = async (mix) => {
        dispatch(saveUpdateMix(mix));
        socket.current.emit('mix-updated', mix);
      }
    
    {/* && !currSong?.isPlaying && currSong?.id === item.id */ }

    return (
        <div className="songs">
            <div className="songs-details-main ">
                <ReactDragListView className="presentation" {...dragProps}>
                    <ul>
                        {data.map((item, index) => (
                            <li className="list-group-item drag-song" key={index}>
                                <div className="song-container">
                                    <div className='songs-details'>
                                        <span onClick={() => handlePlaySong(item, index)}>{item.title}</span>
                                        <div className="actions">
                                            {(!item.isPlaying) ? <span onClick={() => handlePlaySong(item, index)}><img className="play" src={Play}/></span>
                                                : <span onClick={() => handlePauseSong(item, index)}><img className="play" src={Pause}/></span>}
                                            <a className="drag-song"> <img className="up-down" src={UpDown}/></a>
                                            <button onClick={() => handleSongRemove(item, index)}><Trash className="trash" /></button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ReactDragListView>
            </div>
        </div>
    );
}

export default ListDrag;