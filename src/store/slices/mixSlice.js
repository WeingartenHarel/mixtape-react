import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { mixService } from '../../services/mixService';

export const getMix = () => async (dispatch) => {
    try {
        const result = await mixService.query()
        dispatch(setMix(result));
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};

export const getMixById = (mixId) => async (dispatch) => {
    try {
        const result = await mixService.query(mixId)
        dispatch(setCurrentMix(result));
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};

export const removeMix = (mixId) => async (dispatch) => {
    try {
        const result = await mixService.remove(mixId)
        dispatch(setMix(result));
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};

export const saveMix = (mix) => async (dispatch) => {
    try {
        const result = await mixService.save(mix)
        dispatch(setCurrentMix(result));
        return result
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};

export const updateMix = (mix) => async (dispatch) => {
    try {
        const result = await mixService.update(mix)
        dispatch(setCurrentMix(result));
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};

export const saveUpdateMix = (mix) => async (dispatch) => {
    try {
        if (!mix._id) {
            const newMix = await mixService.save(mix);
            console.log('saveUpdateMix newMix', newMix._id)
            dispatch(setCurrentMix(newMix));

            // router.push(`/`)
            // router.push(`/mix/details/${newMix._id}`)
        } else {
            const mixUpdated = await mixService.update(mix);
            dispatch(setCurrentMix(mixUpdated));
            return mix
        }
    } catch (error) {
        console.error('Error fetching mix:', error);
    }
};



const mixSlice = createSlice({
    name: 'mix',
    initialState: {
        mixs: null,
        mixsUser: null,
        genres: ['funk', 'pop', 'rock', 'electro', 'classic', 'israeli', 'techno', 'trance'],
        genreToDisplay: 'all',
        currentMix: null,
        currSong: null,
        topMixes: null,
        newMix: {
            name: "Mix Name",
            desc: "Mix description",
            genre: "genre",
            isLiked: false,
            imgUrl: "https://res.cloudinary.com/hw-projects/image/upload/v1606479695/appmixes/logo_r_animated_v3_first_Frame.jpg",
            likes: 0,
            tags: [
                "Funk",
                "Happy"
            ],
            createdBy: {
                _id: "u101",
                fullName: `guest`,
                imgUrl: 'https://res.cloudinary.com/hw-projects/image/upload/v1606654351/appmixes/user_headphones.png'
            },
            likedByUsers: [

            ],
            songs: [
                {
                    title: "songs goes here",
                    id: "i6Hdm",
                    songUrlId: "",
                    imgUrl: "https://res.cloudinary.com/hw-projects/image/upload/v1606654351/appmixes/user_headphones.png",
                    addedBy: "minimal-user",
                    duration: "0:00",
                    isPlaying: false
                },
            ]
        },
    },

    reducers: {
        setMix: (state, action) => {
            state.mixs = action.payload
        },
        setMixUser: (state, action) => {
            // let mixsCopy = [...state.mixs]

            let mixsCopy = JSON.parse(JSON.stringify(state.mixs))
            const user = action.payload
            const mixsUser = mixsCopy.filter(mix => mix.createdBy._id === user._id)
            console.log('mixsUser', mixsUser)
            state.mixsUser = mixsUser
        },
        setGenreToDisplay: (state, action) => {
            state.genreToDisplay = action.payload
        },
        setMixNew: (state, action) => {
            state.currentMix = state.newMix
        },
        updateCurrentMix: (state, action) => {
            state.currentMix = action.payload
        },
        setCurrentMix: (state, action) => {
            state.currentMix = action.payload
        },
        setCurrentMixById: (state, action) => {
            if (!state.mixs) return
            let mixsCopy = [...state.mixs]
            const mixId = action.payload
            const mixsFiltered = mixsCopy.filter(mix => mix._id === mixId)[0]
            state.currentMix = mixsFiltered
        },
        setCurrentSong: (state, action) => {
            state.currSong = action.payload
        },
        setSortedMixes: (state, payload) => {
            const mixCopy = [...state.mixs]
            const sortby = 'likes'
            mixCopy.sort(function (a, b) {
                var numA = a[sortby];
                var numB = b[sortby];
                return numB - numA;
            });
            let resSliced = mixCopy.slice(0, 3);
            state.topMixes = resSliced;
        },
        setCurrentSongPlay: (state, action) => {
            state.currSong = action.payload
        },
        setCurrentSongPause: (state, action) => {
            state.currSong = action.payload
        },
        setPrevSongNotPlaying(state, payload) {
            state.mixs.songs[payload.songIdx].isPlaying = false;
        },
        setCurrentSongPause(state, payload) {
            state.currSong.isPlaying = false;
        },
        setCurrentSongPlay(state, payload) {
            state.currSong.isPlaying = true;
        },
    }

})


export const { setMix, setMixUser, setGenreToDisplay, setCurrentMix, setCurrentSong,
    setSortedMixes, setCurrentMixById, setMixNew, setPrevSongNotPlaying, updateCurrentMix ,
    setCurrentSongPause ,setCurrentSongPlay
} = mixSlice.actions
export default mixSlice.reducer