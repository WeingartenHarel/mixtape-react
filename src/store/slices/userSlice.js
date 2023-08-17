import { createSlice } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

export const loginUser =  (userCred) => async (dispatch)  =>{
    try {
        const user = await userService.login(userCred);
        dispatch(setUser(user))
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export const logOut =  () => async (dispatch)  =>{
    try {
        dispatch(setUserLogOut(null))
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export const signUpUser =  (userCred) => async (dispatch)  =>{
    try {
        const user = await userService.signup(userCred);
        dispatch(setUser(user))
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export const getUser = () => async (dispatch) => {
    try {
        const result = await userService.query()
        dispatch(setUser(result));
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const getUserById = (userId) => async (dispatch) => {
    try {
        const result = await userService.query(userId)
        dispatch(setCurrentUser(result));
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const removeUser = (userId) => async (dispatch) => {
    try {
        const result = await userService.remove(userId)
        dispatch(setUser(result));
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const saveUser = (user) => async (dispatch) => {
    try {
        const result = await userService.save(user)
        dispatch(setCurrentUser(result));
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const updateUser = (user) => async (dispatch) => {
    try {
        const result = await userService.update(user)
        dispatch(setCurrentUser(result));
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loggedInUser: null,
        users: [],
        isLogin: false,
        isSignup: false
    },
    reducers: {
        setUser: (state, action) => {
            state.loggedInUser = action.payload
            state.isLogin = true
        },
        setUserLogOut: (state, action) => {
            state.loggedInUser = action.payload
            state.isLogin = false
        },
        setCurrentUser: (state, action) => {
            state.loggedInUser = action.payload
            state.isLogin = true
        },
    }

})


export const { setUser, setGenreToDisplay, setCurrentUser, setCurrentSong, setSortedUseres, setCurrentUserById ,setUserLogOut} = userSlice.actions
export default userSlice.reducer