import * as actionTypes from "./actionTypes";



export const setUserCredentials = payload => {
    return {
        type: actionTypes.SET_USER_CREDENTIALS,
        payload
    }
}

export const getPrivateChannel = payload => {
    return {
        type: actionTypes.SET_PRIVATE_CHANNEL,
        payload
    }
}

export const setSingleVideo = payload => {
    return {
        type: actionTypes.SET_SINGLE_VIDEO,
        payload
    }
}


export const setChannelVideos = payload => {
    return {
        type: actionTypes.SET_CHANNEL_VIDEO_LIST,
        payload
    }
}

export const addVideoToChannel = payload => {
    return {
        type: actionTypes.ADD_VIDEO_TO_CHANNEL,
        payload
    }
}
