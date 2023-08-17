import React, { useState, useEffect, useContext, useParams, useRef } from 'react';
import { SocketContext } from '../../context/socket';
import { Link } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  generatePath,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import MixSongs from '../MixSongs/MixSongs';
import MixChat from '../MixChat/MixChat';
import { setCurrentMixById, setCurrentMix, getMix, saveMix, updateMix, setMixNew, saveUpdateMix } from '../../store/slices/mixSlice'
import { uploadImg } from "../../services/imgUploadService.js";

// import { io } from "socket.io-client";
import Chat from '../../Assets/chat.svg'
import Edit from '../../Assets/edit.svg'
import Save from '../../Assets/save.svg'
import Eye from '../../Assets/eye.svg'
import Heart from '../../Assets/heart.svg'
import Heartred from '../../Assets/heartred.svg'
import Loader from '../../Assets/loader.gif'

const MixDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const { mixs } = useSelector((state) => state.mixs)
  const { genres } = useSelector((state) => state.mixs)
  const mixIdFromQuery = searchParams.get('mixId');
  const [mixId, setMixId] = useState(null);
  const { currentMix } = useSelector(state => state.mixs);
  const [currentMixCopy, setCurrentMixCopy] = useState({});
  const [chatIsShow, setChatIsShow] = useState(false);

  const [isTitleHide, setTitleHide] = useState(false);
  const [isImgHide, setImgHide] = useState(false);
  const [isDescHide, setDescHide] = useState(false);
  const [isGenreHide, setGenreHide] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [songTime, setSongTime] = useState(0);
  const [imgUrls, setImgUrls] = useState([]);
  const [fooEvents, setFooEvents] = useState([]);
  const { loggedInUser } = useSelector((state) => state.user); // Replace 'state.loggedInUser' with your actual state slice containing the logged-in user

  useEffect(() => {
    const mixId = queryParams.get('mixId');
    setMixId(mixId)
  }, [queryParams]);

  useEffect(() => {
    const mixId = queryParams.get('mixId');
    if (mixId === 'newmix') {
      dispatch(setMixNew());
      return
    }
    if (!mixs) return
    dispatch(setCurrentMixById(mixId));
  }, [mixs]);

  useEffect(() => {
    const mixCopy = { ...currentMix }
    setCurrentMixCopy(mixCopy)
  }, [currentMix]);

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    const mixCopy = { ...currentMix }
    setCurrentMixCopy((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChange = async (mix) => {
    const mixId = queryParams.get('mixId');

    // create save mix
    if (!mixs) return
    if (mixId === 'newmix') {
      if (loggedInUser) {
        currentMixCopy.createdBy = loggedInUser
      }

      const mixResult = await dispatch(saveMix(currentMixCopy));
      handleSelectMix(mixResult)
      toggleShowHideAll(false)
      return
    }
 
    // update mix
    saveUpdateMixAndEmit(currentMixCopy)
    // dispatch(updateMix(currentMixCopy))
    toggleShowHideAll(false)
  };

  const saveUpdateMixAndEmit = (mix) => {
    dispatch(saveUpdateMix(mix));
    socket.current.emit('mix-updated', mix);
  }

  const handleSelectMix = (mix) => {
    dispatch(setCurrentMix(mix))
    const path = generatePath(`/mix?mixId=${mix._id}`);
    navigate(path);
  };

  const toggleEditTitle = () => {
    setTitleHide(!isTitleHide);
  };

  const toggleEditImg = () => {
    setImgHide(!isImgHide);
  };

  const toggleEditDesc = () => {
    setDescHide((prevDescHide) => !prevDescHide);
  };

  const toggleEditGenre = () => {
    setGenreHide((prevDescHide) => !prevDescHide);
  };

  const toggleShowHideAll = (value) => {
    setTitleHide(value)
    setImgHide(value)
    setDescHide(value)
    setGenreHide(value)
  }

  const onUploadImg = async (ev) => {
    setLoading(true);
    const res = await uploadImg(ev);
    setImgUrls((prevState) => [...prevState, res.url])
    if (currentMixCopy) {
      currentMixCopy.imgUrl = res.url
    }
    handleSaveChange(currentMixCopy)
    setLoading(false);
  };

  const addLike = () => {
    let currentMixCopy = JSON.parse(JSON.stringify(currentMix));
    if (loggedInUser) {
      const isLikedByUserIndex = currentMixCopy.likedByUsers.findIndex(user =>user._id === loggedInUser._id)
      if (isLikedByUserIndex === -1) {
        currentMixCopy.likes++;
        currentMixCopy.likedByUsers.push(loggedInUser);
      } else return
    }else{
      currentMixCopy.likes++;
    } 
    saveUpdateMixAndEmit(currentMixCopy)
  };

  const updateViews = () => {
    // Implement the logic to update the views count
    // You can dispatch an action using Redux if needed
  };

  const playSongOnStart = () => {
    // Implement the logic to play the first song on start
    // You can use the useEffect hook to handle side effects
    // For example, use a WebSocket to synchronize song playing across clients
  };

  const toggleShow = () => {
    setChatIsShow((prevChatIsShow) => !prevChatIsShow);
  };

  return (
    <>
      {currentMix && <section className="mix-details flex">
        <div className="mix-full-info flex">
          <section className="header-mix-info flex">
            <section className="mix-img flex start">
              <form>
                {!isImgHide ? <div className="update-img-mix">
                  <label className="imgUploader">
                    <img className='mix-image' src={currentMix.imgUrl} />
                    <span onClick={toggleEditImg} className="image-edit-button"><img src={Edit} /></span>

                  </label>
                </div>
                  : <div>
                    {!isLoading ? <div className='upload-container'>
                      <input
                        type="file"
                        name="img-uploader"
                        id="imgUploader"
                        onChange={onUploadImg}
                        className="img-uploader"
                      />
                      <p>Drag your files here or click in this area.</p>
                    </div> : <img
                      className="loader"
                      src={Loader}
                    />}
                  </div>}
              </form>
            </section>
            <section className="mix-info-main">
              <section className="mix-info">
                {/* mix title */}
                {!isTitleHide ? <h2 className="mix-title">{currentMix.name}
                  <span onClick={toggleEditTitle} className="edit-txt">
                    <span><img src={Edit} /></span><i className="edit fas fa-pen"></i></span>
                </h2>
                  : <div className="input-container">
                    <input onChange={(e) => handleChange(e)} className="input-title" value={currentMixCopy.name} name="name" type="text" />
                    <span onClick={handleSaveChange} > <img src={Save} /></span>
                  </div>}

                {/* mix description */}
                {!isDescHide ? <p className="description">{currentMix.desc}
                  <span onClick={toggleEditDesc}><img src={Edit} /></span>
                </p>
                  : <div className="textarea-container flex">
                    <textarea onChange={(e) => handleChange(e)} value={currentMixCopy.desc} name="desc"></textarea>
                    <span onClick={handleSaveChange}> <img src={Save} /></span>
                  </div>}

                {/* mix genre */}
                <div className="mix-genre">
                  {!isGenreHide ? <><h4>{currentMix.genre}</h4>
                    <span onClick={toggleEditGenre}><img src={Edit} /></span></>
                    : <>
                      <select name="genre" value={currentMixCopy.genre} onChange={handleChange}>
                        {genres.map((genre) => (
                          <option key={genre} name="genre" value={genre}>{genre}</option>
                        ))}
                      </select>
                      <span onClick={handleSaveChange}> <img src={Save} /></span>
                    </>}
                </div>

                {/* mix likes */}
                <div className="stats">
                  <div className="mix-views">
                    <h4>{currentMix.views}</h4>
                    <img src={Eye} />
                  </div>
                  <div className="mix-like">
                    <div className="like-song">
                      <span className="likes-count">{currentMix.likes}</span>
                      <i onClick={addLike} className="heartMode far fa-heart">
                        {currentMixCopy.isLiked ? <img src={Heartred} /> : <img src={Heart} />}
                      </i>
                    </div>
                  </div>
                </div>
              </section>

              {/* user info */}
              <section className="user-info">
                <h5>
                  <span>Created by: <img src={currentMix.createdBy?.imgUrl} /></span>
                  <span>{currentMix.createdBy.fullName}</span>
                </h5>
              </section>
              <section className="general-info"></section>
            </section>
          </section>

          <div className="search-and-social">
            {/* <div className="currentMixHide"> {{currentMix}}</div> */}
          </div>

          <div className="songs">
            <MixSongs currentMix={currentMix} />
          </div>
        </div>

        <div className="chat-icon" onClick={toggleShow}>
          <img src={Chat} />
        </div>

        <div className={`mix-chat ${chatIsShow ? 'display-chat' : 'hide-chat'}   `} >
          <MixChat mixId={mixId} />
        </div>

      </section>}
    </>

  );
};

export default MixDetails;