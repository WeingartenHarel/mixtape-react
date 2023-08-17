import HttpService from './HttpService'
// const KEY = 'usersDB';
  
export const userService = {
    query,
    getById,
    remove,
    save,
    update,
    login,
    logout,
    signup
}

function query() {
    return HttpService.get('user');
}

function getById(userId) {
    return HttpService.get(`user/${userId}`);
}

function remove(userId) {
    return HttpService.delete(`user/${userId}`);
}

function save(user) {
    return HttpService.post('user', user);
}

function update(user) {
    return HttpService.put(`user/${user._id}`, user);
}

async function login(userCred) {
    const user = await HttpService.post('auth/login', userCred)
    return _handleLogin(user)
}
async function logout() {
    await HttpService.post('auth/logout');
    sessionStorage.clear();
}
async function signup(userCred) {
    console.log('service signup',userCred)
    const user = await HttpService.post('auth/signup', userCred)
    return _handleLogin(user)
}


function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}
