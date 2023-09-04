import React, { useState, useEffect } from "react";
import { postAPI } from "../../services/post/post.service";
import NoContent from "../../images/video-content.png";
import Avatar from '@mui/material/Avatar';
import {Link} from "react-router-dom";
import BaseTemplate from "../../common/BaseTemplate";
import { customDate } from "../../utils/convertDate";
import IconButton from '@mui/material/IconButton';
import ContentLoader from "react-content-loader";
import VideoList from "./VideoList";
import Tooltip from '@mui/material/Tooltip';

const FetchVideos = props => {
    const [videos, setVideos] = useState([])
    const [loader, setLoader] = useState(false)

    useEffect(()=>{
        // fetch videos on component mount
        setLoader(true);
        postAPI.getVideoFeed().then(resp=> {
            setVideos(resp)
            setLoader(false)
        }).catch(err=> err)


    }, [])

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


    return (
        <VideoList>
        <div className="videoTab">
            {!loader && videos.length ? videos.map(item=>{

                return(
                    <div>

                        <div className="videoThumb" style={{ background:`url(${item.thumbnail})`, backgroundSize:"cover", backgroundRepeat:"no-repeat", objectFit:"cover", height: 220, borderRadius:"10px", width:"100%", position:"relative" }}>
                            <span className="timer">{formatDuration(item.vid_time)}</span>
                        </div>

                        <div className="video_metadata">
                            <Avatar src={item.channel.logo} sx={{ bgcolor: "#4CAF50", margin:"5px 0", marginRight:"5px" }}>{item.channel.name.charAt(0)}</Avatar>

                            <div className="metadata">
                                <p className="title_video">
                                    <Tooltip sx={{ lineHeight:"30px", fontSize:"20px" }} title={item.title}>
                                    <strong className="title-emphasis">
                                        <Link style={{ color:'#1A1A1D', textDecoration:"none", cursor:"pointer", fontSize: 17, fontWeight: 1000 }} to={`/channel/${item.channel.id}/video/${item.id}`}>{item.title.length > 34  ? item.title.substring(0, 34) + "..." : item.title}</Link>
                                    </strong>
                                    </Tooltip>
                                    <IconButton size="small" sx={{ borderRadius:"50px", width:"35px", height:"35px", backgroundColor:"none", color:"black"}}>
                                        <span style={{ fontSize:"15px" }} className="pi pi-ellipsis-v"></span>
                                    </IconButton>
                                </p>
                                <div style={{ fontSize: 14 }}>
                                    <Link style={{ color:"#949494", textDecoration:"none" }} to={`/${item.channel.name}`}>
                                        {item.channel.name}
                                    </Link>
                                </div>
                                <p style={{ margin:0, padding:0, lineHeight:"20px", fontSize: 15 }}>16K views <span className="timers">{customDate(item.pub_date)}</span></p>
                            </div>
                        </div>
                    </div>
                )
            }) : ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(item=>{
                return (
                    <div>
                    <ContentLoader
                        speed={8}
                        width={390}
                        height={280}
                        viewBox="0 0 400 280"
                        backgroundColor="#e5e0e0"
                        foregroundColor="#ecebeb"
                        {...props}
                    >
                        <rect x="0" y="0" rx="5" ry="5" width="100%" height="220" />
                        <rect x="0" y="230" rx="50%" ry="50%" width="50" height="50" />
                        <rect x="60" y="240" rx="5" ry="5" width={"75%"} height="10" />
                        <rect x="60" y="255" rx="5" ry="5" width={"55%"} height="10" />
                        <rect x="60" y="270" rx="5" ry="5" width={"35%"} height="10" />
                    </ContentLoader>
                    </div>
                )
            }))}
        </div>
        </VideoList>
    )


}

export default FetchVideos;
