import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../common/Navbar";
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Resumable from "resumablejs";
import Kitty from "../../images/raise_kitty.webp";
import ChannelLogo from "../../images/logo.jpg";
import NoContent from "../../images/video-content.png";
import { postAPI } from "../../services/post/post.service";
import Avatar from '@mui/material/Avatar';
import {Link} from "react-router-dom";
import { MdOutlineVideoLibrary, MdOutlineSubscriptions, MdOutlineWatchLater } from "react-icons/md";
import { GrHomeRounded } from "react-icons/gr";
import { RxVideo } from "react-icons/rx";



const VideoList = props => {
    const [videos, setVideos] = useState([])

    const listRef = useRef(null);


    useEffect(()=>{
        postAPI.getVideoFeed().then(resp=>{
            setVideos(resp)
        }).catch(error=>{
            return error;
        })
    },[props])


    const selectMenu = (event) => {
        const list_elements = document.getElementsByClassName("menu")
        Array.from(list_elements).forEach(item=>{
            item.classList.remove("active");
        })
        event.target.classList.add("active");
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

    const displayVideos = () => {
       return videos.length ? videos.map(item=>{
            return(
                <div style={{ padding:"0 10px", width:"25%" }}>
                    <div style={{ background:`url(${item.thumbnail})`, backgroundSize:"cover", backgroundRepeat:"no-repeat", objectFit:"cover", height: 180, borderRadius:"10px", width:"100%", position:"relative" }}>
                        <span className="timer">{formatDuration(item.vid_time)}</span>
                    </div>
                    <div className="video_metadata">
                        <Avatar src={item.channel.logo} sx={{ bgcolor: "#4CAF50", margin:"5px 0", marginRight:"5px" }}>{item.channel.name.charAt(0)}</Avatar>
                        <div className="metadata">
                            <p title={item.title} className="title_video"><strong>
                                <Link style={{ color:'#1A1A1D', textDecoration:"none", cursor:"pointer", fontSize: 16, fontWeight: 999 }} to={`/channel/${item.channel.id}/video/${item.id}`}>{item.title.length > 31  ? item.title.substring(0, 31) + "..." : item.title}</Link>
                            </strong></p>
                            <span style={{ fontSize: 13 }}>{item.channel.name}</span>
                            <p style={{ margin:0, padding:0, lineHeight:"20px", fontSize: 13 }}>16K views 2hrs ago</p>
                        </div>
                    </div>
                </div>
            )
        }) : <div style={{ height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" }}>
                    <img src={NoContent} style={{ width: 200, height: 200 }} alt="no-content" />
                    <p style={{ fontWeight:650, fontFamily:"Roboto", color:"#aeaeae", padding:0, margin:0, fontSize:20, lineHeight:"30px", textAlign:"center" }}>Upload Video Content</p>
                </div>
            </div>;
    }


    return (
        <Navbar>
            <div className="bodyTemplate">
                <aside>
                    <ul className="sidebar">
                        <li ref={listRef} onClick={selectMenu} className="menu active"><span><GrHomeRounded fontSize={20} style={{ verticalAlign:"center", margin:0 }} /></span> Home</li>
                        <li onClick={selectMenu} className="menu"><span><MdOutlineSubscriptions fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Subscriptions</li>
                        <li onClick={selectMenu} className="menu"><span><MdOutlineVideoLibrary fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Library</li>
                        <li onClick={selectMenu} className="menu"><span><HistoryIcon style={{ verticalAlign:"center", margin:0 }} /></span> History</li>
                        <li onClick={selectMenu} className="menu"><span><MdOutlineWatchLater fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Watch Later</li>
                        <li onClick={selectMenu} className="menu"><span><RxVideo fontSize={30} style={{ verticalAlign:"center", margin:0, fontSize: 25 }} /></span> Your videos</li>
                        <li onClick={selectMenu} className="menu"><span></span></li>
                    </ul>
                </aside>
                <section>
                    <div></div>
                    <div className="videoTab">
                        {displayVideos()}
                    </div>
                </section>
            </div>
        </Navbar>
    );
}



export default VideoList;
