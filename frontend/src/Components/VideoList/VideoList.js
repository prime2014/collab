import React, { useEffect, useRef, useState } from "react";
import NoContent from "../../images/video-content.png";
import { postAPI } from "../../services/post/post.service";
import Avatar from '@mui/material/Avatar';
import {Link} from "react-router-dom";
import BaseTemplate from "../../common/BaseTemplate";
import { customDate } from "../../utils/convertDate";
import IconButton from '@mui/material/IconButton';



const VideoList = props => {
    // const [videos, setVideos] = useState([])

    // const listRef = useRef(null);


    useEffect(()=>{
        // postAPI.getVideoFeed().then(resp=>{
        //     setVideos(resp)
        // }).catch(error=>{
        //     return error;
        // })
    },[])



    // const zeroFormatter = new Intl.NumberFormat(undefined, {
    //     minimumIntegerDigits: 2
    // })

    // const formatDuration = (time) => {
    //     const seconds = Math.floor(time % 60)
    //     const minutes = Math.floor(time / 60) % 60
    //     const hours = Math.floor(time / 3600)

    //     if(hours === 0) {
    //         return `${minutes}:${zeroFormatter.format(seconds)}`
    //     } else {
    //         return `${hours}:${zeroFormatter.format(minutes)}:${zeroFormatter.format(seconds)}`
    //     }
    // }

    const handleBackground = event => event.currentTarget.classList.add("expose");

    const removeBackground = event => event.currentTarget.classList.remove("expose");

    // const displayVideos = () => {
    //    return videos.length ? videos.map(item=>{
    //         return(
    //             <div>
    //                 <div style={{ background:`url(${item.thumbnail})`, backgroundSize:"cover", backgroundRepeat:"no-repeat", objectFit:"cover", height: 202, borderRadius:"10px", width:"100%", position:"relative" }}>
    //                     <span className="timer">{formatDuration(item.vid_time)}</span>
    //                 </div>
    //                 <div className="video_metadata">
    //                     <Avatar src={item.channel.logo} sx={{ bgcolor: "#4CAF50", margin:"5px 0", marginRight:"5px" }}>{item.channel.name.charAt(0)}</Avatar>
    //                     <div className="metadata">
    //                         <p title={item.title} className="title_video">
    //                             <strong>
    //                                 <Link style={{ color:'#1A1A1D', textDecoration:"none", cursor:"pointer", fontSize: 17, fontWeight: 1000 }} to={`/channel/${item.channel.id}/video/${item.id}`}>{item.title.length > 34  ? item.title.substring(0, 34) + "..." : item.title}</Link>
    //                             </strong>
    //                             <IconButton size="small" sx={{ borderRadius:"50px", width:"35px", height:"35px", backgroundColor:"none", color:"black"}}>
    //                                 <span className="pi pi-ellipsis-v"></span>
    //                             </IconButton>
    //                         </p>
    //                         <span style={{ fontSize: 15 }}>{item.channel.name}</span>
    //                         <p style={{ margin:0, padding:0, lineHeight:"20px", fontSize: 15 }}>16K views <span className="timers">{customDate(item.pub_date)}</span></p>
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     }) : <div style={{ height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center" }}>
    //             <div style={{ display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" }}>
    //                 <img src={NoContent} style={{ width: 200, height: 200 }} alt="no-content" />
    //                 <p style={{ fontWeight:650, fontFamily:"Roboto", color:"#aeaeae", padding:0, margin:0, fontSize:20, lineHeight:"30px", textAlign:"center" }}>Upload Video Content</p>
    //             </div>
    //         </div>;
    // }


    return (
        <BaseTemplate>
            {props.children}
        </BaseTemplate>
    );
}



export default VideoList;
