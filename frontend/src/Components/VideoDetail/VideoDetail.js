import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../common/Navbar";
import { MdPictureInPictureAlt, MdFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { ImCog } from "react-icons/im";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdPause, IoMdPlay, IoMdVolumeLow } from "react-icons/io";
import { MdSubtitles } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getSingleVideo } from "../../redux/actionDispatch";
import { connect } from "react-redux";
import { IsAvailable } from "../../utils/convertDate";
import Avatar from '@mui/material/Avatar';
import { TfiDownload } from "react-icons/tfi";
import { IoEllipsisHorizontal } from "react-icons/io5";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import { BsEmojiLaughing, BsFillPlayBtnFill } from "react-icons/bs";
import Tooltip from '@mui/material/Tooltip';
import { postAPI } from "../../services/post/post.service";
import { customizeLikes } from "../../utils/convertDate";

let wasPaused = false;
let isScrubbing = false;


const VideoDetail = (props) => {
    const [volume, setVolume] = useState(1)
    // const [isScrubbing, setIsScrubbing] = useState(false)
    const [videoError, setError] = useState(null);
    const [commentBtnDisabled, setCommentBtnDisabled] = useState(true)
    const [comment, setComment] = useState("");
    const [video, setVideo] = useState({})

    let fileObject = URL.createObjectURL;
    // const [wasPaused, setWasPaused] = useState(false);
    // const [isScrubbing, setIsScrubbing] = useState(false);
    const videoRef = useRef(null);
    const videoContainer = useRef(null);
    const textInputRef = useRef(null);
    const timelineContainer = useRef(null);
    const [startChunk, setStartChunk] = useState(0)
    const [endChunk, setEndChunk] = useState(1024 * 3072)
    const [isLoading, setIsLoading] = useState(false)
    const [fileSize, setFileSize] = useState(0)
    let { video_id } = useParams()
    let mediaSource = new MediaSource()
    let sourceBuffer = null;






    useEffect(()=>{

        props.getSingleVideo(video_id).then(resp=>{
            setVideo(resp);
            setMediaSource();
        })

        return () => {
            console.log("REMOVING...")
            let video = videoRef.current;
            video.pause()
            removeSourceBuffer();
        }

    },[])


    const removeSourceBuffer = () => {
        if (mediaSource.sourceBuffers.length){
            mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0])
        }

    }


    useEffect(()=>{

        let video = videoRef.current;

        let videoContainer = document.querySelector(".video-container");
        document.addEventListener("fullscreenchange", ()=>{
            videoContainer.classList.toggle("full-screen", document.fullscreenElement)
        })

        video.addEventListener("enterpictureinpicture", ()=>{
            videoContainer.classList.add("mini-player");
        });

        video.addEventListener("leavepictureinpicture", ()=>{
            videoContainer.classList.remove("mini-player");
        })

        document.addEventListener("mouseup", (e)=>{
            if(isScrubbing) toggleScrubbing(e)
        })

        document.addEventListener("mousemove", (e)=>{
            if(isScrubbing) handleTimelineUpdate(e)
        })

        return () => {
            document.removeEventListener("fullscreenchange", ()=>{
                videoContainer.classList.toggle("full-screen", document.fullscreenElement)
            })

            video.removeEventListener("enterpictureinpicture", ()=>{
                videoContainer.classList.add("mini-player");
            });

            video.removeEventListener("leavepictureinpicture", ()=>{
                videoContainer.classList.remove("mini-player");
            })

            document.removeEventListener("mouseup", (e)=>{
                if(isScrubbing) toggleScrubbing(e)
            })

            document.removeEventListener("mousemove", (e)=>{
                if(isScrubbing) handleTimelineUpdate(e)
            })
        }

    },[])

    const playPauseVideo = (event) =>{
        let video = videoRef.current
        video.paused ? video.play() : video.pause()
    }

    const handlePlay = event => {

        let videoContainer = document.querySelector(".video-container");
        videoContainer.classList.remove("paused");

    }

    const fetchMediaChunk = async () => {
        try {
            let video_chunk = null;
            let url = process.env.REACT_APP_STREAMING_API + "/app/video?video=my_r10_skills.webm";

            let resp = await new Promise((resolve, reject)=>{
                const xhr = new XMLHttpRequest();
                xhr.open('get', url);
                xhr.responseType = 'arraybuffer';
                xhr.setRequestHeader("content-type", "video/webm")
                xhr.setRequestHeader("range", `bytes=${startChunk},${endChunk}`)

                xhr.onload = () => {
                    // append the video segment to the buffer

                    video_chunk = xhr.response;

                    setFileSize(parseInt(xhr.getResponseHeader("X-Size")))
                    resolve(video_chunk)

                };
                xhr.send();
            })

            return resp;
        } catch(error){
            return error;
        }
    }



    const sourceOpen = async event => {
        URL.revokeObjectURL(videoRef.current.src);


        mediaSource.duration = 345;

        let vidBlob = await fetchMediaChunk()

        if(!vidBlob.byteLength){
            alert("File not found!")
        }
        let mimeCodec = 'video/webm;codecs="vp9,opus"';

        if(mediaSource.readyState === 'open') {

            console.log("SOURCE BUFFER: ", mediaSource.sourceBuffers)

            sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

            sourceBuffer.appendBuffer(new Uint8Array(vidBlob));

            sourceBuffer.addEventListener('updateend', function (e) {
                if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                    videoRef.current.play()

                }
            });



        }


    }


    const sourceClose  = event => {
       if (mediaSource.sourceBuffers.length) {
        mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0])
       }
    }


    const setMediaSource = async () => {

        videoRef.current.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', sourceOpen);

        mediaSource.addEventListener("sourceclose", sourceClose);

    }

    const handlePause = event => {
        // if(videoRef.current.currentTime === videoRef.current.duration){
        //     videoRef.current.currentTime = 0;
        // }
        let videoContainer = document.querySelector(".video-container");
        videoContainer.classList.add("paused");
    }

    const handleFullScreen = event => {
        let videoContainer = document.querySelector(".video-container");
        if(document.fullscreenElement === null){
            videoContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    const toggleMiniPlayer = (event) => {
        let videoContainer = document.querySelector(".video-container");

        if(videoContainer.classList.contains("mini-player")){
            document.exitPictureInPicture();
        } else {
            videoRef.current.requestPictureInPicture();
        }
    }

    const changeVolume = event =>{
        let videoContainer = document.querySelector(".video-container");

        videoRef.current.volume = event.target.value;
        videoRef.current.muted = videoRef.current.volume === 0;

        setVolume(event.target.value)


        if(videoRef.current.muted){
            videoContainer.setAttribute('data-volume', "low");
        } else if(videoRef.current.volume <= 0.5){
            videoContainer.setAttribute('data-volume', "middle");
        } else if (0.5 < event.target.value <= 1) {
            videoContainer.setAttribute('data-volume', "high");
        }

    }

    const toggleMute = (event) => {
        let videoContainer = document.querySelector(".video-container");

        videoRef.current.muted = !videoRef.current.muted;
        let volume_state = videoContainer.getAttribute("data-volume")
        if(volume_state === "high"){
            videoContainer.setAttribute("data-volume", "low")
        } else if(volume_state === "middle"){
            videoContainer.setAttribute("data-volume", "middle")
        } else {
            videoContainer.setAttribute("data-volume", "high")
        }
        setVolume(videoRef.current.muted ? 0 : videoRef.current.volume)

    }

    const zeroFormatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2
    })

    const formatDuration = (time) => {
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)

        if(hours === 0) {
            return `${minutes}:${zeroFormatter.format(seconds)}`
        } else {
            return `${hours}:${zeroFormatter.format(minutes)}:${zeroFormatter.format(seconds)}`
        }
    }

    const handleLoadedData = event => {

        let totalTimeElement = document.querySelector(".total-time");
        totalTimeElement.textContent = formatDuration(videoRef.current.duration);
    }

    const handleTimeUpdate = event => {
        let currentTime = document.querySelector(".current-time");
        const percent = videoRef.current.currentTime / videoRef.current.duration;
        currentTime.textContent = formatDuration(videoRef.current.currentTime)
        timelineContainer.current.style.setProperty("--progress-position", percent);
    }

    const handleEnterComment = event => {

        console.log(event.target.value)
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;


        let modified_txt = event.target.textContent.replace(urlRegex, (url)=>"" + <a href={`${url}`} target="_blank">`${url}`</a> + "")
        // let modified_txt = event.target.textContent;


        setComment(modified_txt)
        event.target.textContent =`${modified_txt}`;
        if(modified_txt){
            event.target.classList.add("text");
            setCommentBtnDisabled(false);

        } else {
            event.target.classList.remove("text")
            setCommentBtnDisabled(true);
        }

    }



    const handlePaste = event => {
        event.preventDefault();
        event.target.classList.add("text");

        let paste = (event.clipboardData || window.clipboardData).getData('text');


        let selection = window.getSelection()
        console.log(selection)
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).deleteContents();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste))
        event.target.textContent = selection.toString();
        setCommentBtnDisabled(false);
    }

    const changePlaybackSpeed = event => {
        let newPlaybackRate = videoRef.current.playbackRate + .25
        if (newPlaybackRate > 2) newPlaybackRate = .25;
        videoRef.current.playbackRate = newPlaybackRate;
        event.target.textContent = `${newPlaybackRate}x`;
    }





    const toggleScrubbing = event => {
        event.preventDefault()


        const rect = timelineContainer.current.getBoundingClientRect();
        const percent = Math.min(Math.max(0, event.clientX - rect.x), rect.width) / rect.width;
        console.log(event.buttons)
        isScrubbing = (event.buttons & 1) === 1;

        videoContainer.current.classList.toggle("scrubbing", isScrubbing)
        if(isScrubbing){
            wasPaused = videoRef.current.paused;
            videoRef.current.pause()
            timelineContainer.current.style.setProperty("--progress-position", percent);
        } else {
            console.log("Mouse is up")
            console.log(percent)
            console.log(videoRef.current.currentTime)
            if(!wasPaused) videoRef.current.play()
            videoRef.current.currentTime = percent * videoRef.current.duration;

        }

    }


    const handleTimelineUpdate = event => {
        const rect = timelineContainer.current.getBoundingClientRect();

        const percent = Math.min(Math.max(0, event.clientX - rect.x), rect.width) / rect.width;
        timelineContainer.current.style.setProperty("--preview-position", percent);

        if(isScrubbing){
            event.preventDefault()

            timelineContainer.current.style.setProperty("--progress-position", percent);
        }
    }

    const disableScrubbing = event => {
        isScrubbing = false;
        const rect = timelineContainer.current.getBoundingClientRect();

        const percent = Math.min(Math.max(0, event.clientX - rect.x), rect.width) / rect.width;
        // timelineContainer.current.style.setProperty("--preview-position", percent);


        timelineContainer.current.style.setProperty("--progress-position", percent);
        videoRef.current.currentTime = videoRef.current.duration * percent;
        if(wasPaused) videoRef.current.play()


    }

    const updateTimeline = event => {
        event.preventDefault();
        const rect = timelineContainer.current.getBoundingClientRect();

        const percent = Math.min(Math.max(0, event.clientX - rect.x), rect.width) / rect.width;
        timelineContainer.current.style.setProperty("--progress-position", percent);

        isScrubbing = false;
        wasPaused = false;
        videoRef.current.currentTime = percent * videoRef.current.duration;
        videoRef.current.play()
    }

    const handleLoadedMetadata = event => {
        console.log(event.target.videoTracks)
    }

    const postComment = () => {
        let comment_object = { comment, post:video_id }

        console.log(comment_object)
        setIsLoading(true)
        setCommentBtnDisabled(true)
        postAPI.createComment(comment_object).then(resp=> {
            setIsLoading(prevState=> !prevState)
            setCommentBtnDisabled(prevState=> !prevState)
            textInputRef.current.textContent = "";
            console.log(resp);
        }).catch(error=> console.log(error))
    }


    const handleVideoError = event => {
        switch(event.target.error.code) {
            case event.target.error.MEDIA_ERR_ABORTED:
                setError("You aborted the video playback");
                break;
            case event.target.error.MEDIA_ERR_NETWORK:
                setError("A network error occurred while downloading the video")
                break;
            case event.target.error.MEDIA_ERR_DECODE:
                setError("The video playback was aborted due to corruption problems or due to features the browser does not support");
                break;
            case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                setError("The video could not be loaded, either because the server or network failed or because the format is not supported.")
                break;
            default:
                setError("An unknown error occurred");
                break;
        }
    }

    const setVideoState = event => {
        playPauseVideo(event)
    }

    const handleControlsContainer = event => {
        event.stopPropagation();
    }


    const handleAbortedVideo = event => {
        console.log("handling aborted video")
        if (mediaSource.sourceBuffers.length) {
            mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
        }
    }

    return (
        <Navbar>
            <div className="video_template">
                <div className="video_content">
                    <div className="left-section-video">
                        <div onClick={setVideoState} ref={videoContainer} className="video-container paused" data-volume="high">
                            <div className="actionBtns">
                                <div className="lds-ring">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div>
                                    <BsFillPlayBtnFill style={{ fontSize: 80, color:"crimson" }} />
                                </div>
                            </div>
                            <div onClick={handleControlsContainer} className="video-controls-container">

                                <div onMouseUp={toggleScrubbing} onClick={updateTimeline} onMouseMove={handleTimelineUpdate} ref={timelineContainer} onMouseDown={toggleScrubbing} className="timeline-container">
                                    <div className="timeline">
                                        <div className="thumb-indicator"></div>
                                    </div>
                                </div>
                                <div className="controls">
                                    <Tooltip title="Play" placement="top">
                                    <button onClick={playPauseVideo} className="play-pause-btn play-icon">
                                        <IoMdPlay style={{ fontSize: 30, padding: 0 }} />
                                    </button>
                                    </Tooltip>

                                    <Tooltip title="Pause" placement="top">
                                    <button onClick={playPauseVideo} className="play-pause-btn pause-icon">
                                        <IoMdPause style={{ fontSize:30, padding: 0 }} />
                                    </button>
                                    </Tooltip>
                                    <div className="volume-container">
                                        <Tooltip title="Unmute" placement="top">
                                            <button onClick={toggleMute} className="mute-btn">
                                                <IoMdVolumeOff style={{ fontSize:25, padding:0 }} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Unmute" placement="top">
                                            <button onClick={toggleMute} className="middle">
                                                <IoMdVolumeLow style={{ fontSize:25, padding:0 }} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Mute" placement="top">
                                            <button onClick={toggleMute} className="volume-high-icon">
                                                <IoMdVolumeHigh style={{ fontSize:25, padding:0 }} />
                                            </button>
                                        </Tooltip>

                                        <input onChange={changeVolume} style={{ color:"white" }} className="volume-slider" type={"range"} min={0} max={1} step={"any"} value={volume} />
                                    </div>
                                    <div className="duration-container">
                                        <div style={{ fontSize:13 }} className="current-time">0:00</div>
                                        /
                                        <div style={{ fontSize:13 }} className="total-time"></div>
                                    </div>
                                    <div>
                                        <p className="company-title">Uncensored</p>
                                    </div>
                                    <Tooltip title="Subtitles/closed captions" placement="top">
                                        <button className="captions-btn">
                                            <MdSubtitles style={{ fontSize:30 }} />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Settings" placement="top">
                                        <button className="settings-btn">
                                            <ImCog style={{ fontSize: 25 }} />
                                        </button>
                                    </Tooltip>
                                    <button onClick={changePlaybackSpeed} className="speed-btn wide-btn">
                                        1x
                                    </button>

                                    <Tooltip title="Cinema mode" placement="top">
                                        <button className="theater-mode">
                                            <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-457"></path></svg>
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Miniplayer" placement="top">
                                    <button onClick={toggleMiniPlayer} className="mini-player-btn">
                                        <MdPictureInPictureAlt style={{ fontSize:30 }} />
                                    </button>
                                    </Tooltip>

                                    <Tooltip title="Full screen" placement="top">
                                        <button onClick={handleFullScreen} className="full-screen-btn">
                                            <MdFullscreen style={{ fontSize:33 }} />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Exit full screen" placement="top">
                                        <button onClick={handleFullScreen} className="exit-full-screen-btn">
                                            <MdOutlineFullscreenExit style={{ fontSize: 33 }}/>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                            <video onAbort={handleAbortedVideo} poster={video.thumbnail} onError={handleVideoError} onLoadedMetadata={handleLoadedMetadata} crossOrigin="anonymous" src={""} onTimeUpdate={handleTimeUpdate} onLoadedData={handleLoadedData} controls={false} onPause={handlePause} onPlay={handlePlay} ref={videoRef} className="video">

                            </video>
                        </div>
                        <div className="video-details">
                            <h2 style={{ fontFamily:"Poppins", fontWeight:"bolder" }}>{IsAvailable(video) ? video.title : ""}</h2>

                            <div className="channel-details">
                                <Avatar src={(IsAvailable(video) && video.channel.logo !== null) && video.channel.logo} sx={{ bgcolor: "#4CAF50", padding:0, marginRight:"5px" }}>{IsAvailable(video) && video.channel.name.charAt(0)}</Avatar>
                                <div className="channel-name-content">
                                    <h4>{IsAvailable(video) && video.channel.name}</h4>
                                    <p>1.65M subscribers</p>
                                </div>

                                <div style={{ display:"flex", flexGrow:1 }}>
                                    <button className="subscribe-btn">Subscribe</button>
                                </div>

                                <ButtonGroup sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black", fontSize: 14}} size="small" variant="contained" aria-label="outlined primary button group">
                                    <Button variant="outline" sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black", fontSize: 12, fontWeight:"bolder"}} startIcon={<span className="pi pi-thumbs-up"></span>}>{customizeLikes(video.likes)}</Button>
                                    <Button variant="outline" sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black", fontSize: 12, fontWeight:"bolder"}} startIcon={<span className="pi pi-thumbs-down"></span>}></Button>
                                </ButtonGroup>

                                <Button sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black", fontSize: 12, fontWeight:"bold"}} size="large" startIcon={<ShareIcon style={{ padding:0, margin:0 }} />}>Share</Button>
                                <Button sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black", fontSize: 12, fontWeight:"bold"}} size="large" startIcon={<TfiDownload style={{ padding:0, margin:0 }} />}>Download</Button>
                                <IconButton size="medium" sx={{ borderRadius:"50px", backgroundColor:"#eee", color:"black"}}>
                                    <IoEllipsisHorizontal style={{ padding:0, margin:0 }} />
                                </IconButton>
                            </div>
                            <div className="video-description">
                                <p><span>18k views</span> <span>5 hours ago</span></p>
                                <p>{IsAvailable(video) && video.description}</p>
                            </div>
                            <div className="comment-area">
                                <p>555 Comments</p>
                                <div className="comment-section">
                                    <Avatar src={IsAvailable(props.user) && props.user.avatar} sx={{ bgcolor: "#4CAF50", padding:0, marginRight:"5px" }}>{IsAvailable(props.user) && props.user.first_name.charAt(0)}</Avatar>

                                    <div className="input-artifact">
                                        <div ref={textInputRef} onPaste={handlePaste} onInput={handleEnterComment} role="textbox" className="comment-input-section" contentEditable={true} aria-label="Add a comment..."></div>
                                        <div className="comment-actions">
                                            <span className="emoji-pack"><BsEmojiLaughing style={{ fontSize:20 }} /></span>

                                            <div>
                                                <Button style={{ borderRadius:"50px", fontSize:"12px", fontWeight:"bolder", color:"black" }} variant="text">Cancel</Button>
                                                <Button loading={isLoading} onClick={postComment} style={{ borderRadius:"50px", fontSize:"12px", fontWeight:"bolder" }} disabled={commentBtnDisabled} variant="contained">Comment</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    )
}


const mapStateToProps = state => {
    return {
        user: state.userReducer.credentials
    }
}

const mapDispatchToProps = {
    getSingleVideo
}


export default connect(mapStateToProps, mapDispatchToProps)(VideoDetail);
