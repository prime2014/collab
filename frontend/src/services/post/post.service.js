import axios from "axios";
import cookies from "react-cookies";
import { store_settings } from "../../redux/store";


const baseURL = process.env.REACT_APP_API_URL;


const searchVideos = async (search_text) => {
    const access_token = cookies.load("access")
    try {
        let search_result = null;
        let response = await fetch(baseURL + `/posts/v1/search/?title__contains=${search_text}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        })

        if (response.ok) search_result = response.json();
        console.log(search_result)
        return search_result;
    } catch(err){
        return err.response.data;
    }
}


const getUploadToken = async () => {
    const access_token = cookies.load("access")
    try {
        let token = null;
        let response = await fetch(baseURL + "/posts/upload/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        })
        if (response.ok) token = response.json();
        console.log(token)
        return token;
    } catch(error){
        return error.response.data;
    }
}


const getChannelPrivate = async (url) =>{
    const access_token = cookies.load("access")

    try {
        let channel = null;
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if(response) channel = response.json();
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
        let response = await fetch(baseURL + "/api/posts/v1/videos/", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${access_token}`,
                "token": `${token}`
            },
            body: file,

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
        let response = await fetch(baseURL + `/posts/v1/videos/?channel=${channel}&limit=${limit}&offset=${offset}/`, {
            method: "GET",
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${access_token}`,
            }
        })
        if (response.ok) videos = response.json();
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
        let response = await fetch(baseURL + `/posts/v1/videos/${id}/?channel=${channel_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify(rest)
        })
        if(response) mypost = response.json();
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
        let response = await fetch(baseURL + `/posts/v1/videos/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) videos = response.json();

        return videos
    } catch(error){

        return error.response.data;
    }
}


const getVideoDetail = async (channel_id) =>{
    const access_token = cookies.load("access");

    try {
        let video = null;
        let response = await fetch(baseURL + `/posts/v1/videos/${channel_id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response) video = response.json();
        return video;
    } catch(error) {
        return error.response.data;
    }
}


const getComments = async () => {
    const access_token = cookies.load("access")

    try {
        let comments = null;

        let response = await fetch(baseURL + `/posts/comments/read/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            }
        });
        if (response.ok) comments = response.json();
        return comments;
    } catch(error){
        return error.response.data;
    }
}


const createComment = async my_comment => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await fetch(baseURL + `/posts/comments/write/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(my_comment)
        });
        if (response) comment = response.json();
        return comment;
    } catch(error){
        return error.response.data;
    }
}

const updateComment = async (id, comment) => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await fetch(baseURL + `/posts/comments/write/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify(comment)
        });
        if (response) comment = response.json();
        return comment;
    } catch(error){
        return error.response.data;
    }
}

const deleteComment = async id => {
    const access_token = cookies.load("access")

    try {
        let comment = null;

        let response = await fetch(baseURL + `/posts/comments/write/${id}/`, {
            method: "DELETE",
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
    searchVideos,
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
