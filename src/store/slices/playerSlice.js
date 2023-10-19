import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        isPlaying: false,
        isMuted: true,
        isPartyMode: false,
    },
    reducers: {
        setIsPlaying: (state, action) => {
            // console.log('setIsPlaying action',action.payload)
            state.isPlaying = action.payload
        },
        setIsMuted: (state, action) => {
            state.isMuted = action.payload
        },
        setIsPartyMode: (state, action) => {
            state.isPartyMode = action.payload
        }
    }

})

export const { setIsPlaying, setIsMuted ,setIsPartyMode } = playerSlice.actions
export default playerSlice.reducer