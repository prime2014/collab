import { postAPI } from "../services/post/post.service";
import {
    getPrivateChannel,
    setSingleVideo,
    setChannelVideos,
    addVideoToChannel
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


export const getChannelVideos = (offset, channel_id, limit) => {
    return async dispatch => {
        try {
            let response = await postAPI.getChannelVideos(offset, channel_id, limit);
            if (response) dispatch(setChannelVideos(response));
        } catch(error) {
            return error;
        }
    }
}

export const createPost = (data) => {
    return async dispatch => {
        try {
            let response = await postAPI.updatePost(data);
            if (response) dispatch(addVideoToChannel(response))
            return response;
        } catch(error) {
            return error;
        }
    }
}
