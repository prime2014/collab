import * as actionTypes from "../actionTypes";

export const userReducer = (
    state = {
        credentials: {}
    },
    action) => {
        switch(action.type){
            case actionTypes.SET_USER_CREDENTIALS:

                state = {
                    ...state,
                    credentials: action.payload
                }
                return state;
            default:
                return state;
        }
}


export const channelReducer = (
    state = {
        channel: {}
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_PRIVATE_CHANNEL:
            state = {
                ...state,
                channel: action.payload
            }
            return state;
        default:
            return state;
    }
}


export const videoReducer = (
    state = {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    action
) => {
    switch (action.type) {
        case actionTypes.SET_CHANNEL_VIDEO_LIST:
            state = {
                ...state,
                count: action.payload.count,
                next: action.payload.next,
                previous: action.payload.previous,
                results: action.payload.results
            }
            return state;
        case actionTypes.ADD_VIDEO_TO_CHANNEL:
            let video_list = [...state.results]
            let idx = video_list.findIndex(item=> item.id === action.payload.id)
            if (idx !== -1){
                video_list.splice(idx, 1, action.payload)
            } else {
                video_list.unshift(action.payload)
            }
            state = {
                ...state,
                results: video_list
            }
            return state;
        default:
            return state;
    }
}


