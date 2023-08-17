export const uploadImg = async (ev) => {
    // Defining our variables
    const UPLOAD_PRESET = 'appmixes' // Insert yours
    const CLOUD_NAME = 'hw-projects' // Insert yours
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    // password : Pass1981Cloud$
    const FORM_DATA = new FormData();
    // Building the request body
    FORM_DATA.append('file', ev.target.files[0])
    FORM_DATA.append('upload_preset', UPLOAD_PRESET)
    // Sending a post method request to Cloudniarys' API
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: FORM_DATA
        })
        return res.json();
    } catch (err) {
        console.error('ERROR!', err)
    }
}

