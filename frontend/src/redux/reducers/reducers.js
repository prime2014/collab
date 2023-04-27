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


