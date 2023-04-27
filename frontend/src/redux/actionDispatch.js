import { postAPI } from "../services/post/post.service";
import {
    getPrivateChannel,
    setSingleVideo
} from "./action";


export const getPrivateChannelToDispatch = url => {
    return async dispatch => {
        try {
            let response = await postAPI.getChannelPrivate(url);
            if(response) dispatch(getPrivateChannel(response))
        } catch(error){
            return error;
        }
    }
}


export const getSingleVideo = id => {
    return async dispatch => {
        try {
            let response = await postAPI.getVideoDetail(id);
            if (response) {
                return response;
            }
        } catch(error) {
            return error;
        }
    }
}
