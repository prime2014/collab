import axios from "axios";
import cookies from "react-cookies";
import { store_settings } from "../../redux/store";


const baseURL = process.env.REACT_APP_API_URL;



const getUploadToken = async () => {
    const access_token = cookies.load("access")
    try {
        let token = null;
        let response = await axios.get(baseURL + "/posts/upload/", {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        })
        if (response) token = response.data;
        return token;
    } catch(error){
        return error.response.data;
    }
}


const getChannelPrivate = async (url) =>{
    const access_token = cookies.load("access")

    try {
        let channel = null;
        let response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if(response) channel = response.data;
        console.log(channel)
        return channel;
    } catch(error){
        return error.response.data;
    }
}


const uploadVideo = async (token, file) => {
    const access_token = cookies.load("access")
    try {
        let post = null;
        let response = await axios.post(baseURL + "/api/posts/v1/videos/",  file, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${access_token}`,
                "token": `${token}`
            },
            onUploadProgress: (progressEvent)=>{

            }
        });
        if (response) post = response.data;
        console.log(post);
        return post;
    } catch(error){
        return error.response.data;
    }
}

const getChannelVideos = async (offset, channel, limit) => {
    const access_token = cookies.load("access")
    try {
        let videos = null;
        let response = await axios.get(baseURL + `/posts/v1/videos/?channel=${channel}&limit=${limit}&offset=${offset}/`, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${access_token}`,
            }
        })
        if (response) videos = response.data;
        console.log(videos)
        return videos;
    } catch(error){
        return error.response.data;
    }
}


const updatePost = async post => {
    const access_token = cookies.load("access");
    const channel_id = store_settings.store.getState().channelReducer.channel.id

    let { id, ...rest } = post;
    try {
        let mypost = null;
        let response = await axios.put(baseURL + `/posts/v1/videos/${id}/?channel=${channel_id}`, rest, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        })
        if(response) mypost = response.data;
        console.log(mypost)
        return mypost;
    } catch(error){
        console.log(error.response.data)
        return error.response.data;
    }
}

const getVideoFeed = async () => {
    const access_token = cookies.load("access");
    try {
        let videos = null;
        let response = await axios.get(baseURL + `/posts/v1/videos/`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) videos = response.data;

        return videos
    } catch(error){

        return error.response.data;
    }
}


const getVideoDetail = async (channel_id) =>{
    const access_token = cookies.load("access");

    try {
        let video = null;
        let response = await axios.get(baseURL + `/posts/v1/videos/${channel_id}/`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) video = response.data;
        return video;
    } catch(error) {
        return error.response.data;
    }
}


const getComments = async () => {
    const access_token = cookies.load("access")

    try {
        let comments = null;

        let response = await axios.get(baseURL + `/posts/comments/read/`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) comments = response.data;
        return comments;
    } catch(error){
        return error.response.data;
    }
}


const createComment = async my_comment => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await axios.post(baseURL + `/posts/comments/write/`, { ...my_comment }, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) comment = response.data;
        return comment;
    } catch(error){
        return error.response.data;
    }
}

const updateComment = async (id, comment) => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await axios.put(baseURL + `/posts/comments/write/${id}/`, { ...comment }, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) comment = response.data;
        return comment;
    } catch(error){
        return error.response.data;
    }
}

const deleteComment = async id => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await axios.delete(baseURL + `/posts/comments/write/${id}/`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) comment = response.status;
        return comment;
    } catch(error){
        return error.response.data;
    }
}


export const postAPI = {
    getUploadToken,
    uploadVideo,
    getChannelPrivate,
    getChannelVideos,
    updatePost,
    getVideoFeed,
    getVideoDetail,
    getComments,
    createComment,
    updateComment,
    deleteComment
}
