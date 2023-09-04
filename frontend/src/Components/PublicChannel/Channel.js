import React, { useState, useLayoutEffect, useEffect } from "react";
import BaseTemplate from "../../common/BaseTemplate";
import Banner from "../../images/banner.jpg";
import { Avatar } from 'primereact/avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TabMenu from "./TabComponent";


const Channel = props => {

    const [activeTab, setTab] = useState(0);
    const [tabMenu] = useState(["HOME", "VIDEOS", "SHORTS", "LIVE", "PODCASTS", "PLAYLISTS", "COMMUNITY", "CHANNELS", "ABOUT"])
    const [tabPosition, setTabPosition] = useState(0)


    const changeActiveTab = event => {
        var tabLayer = document.getElementById("presentation_layer");
        tabLayer.style.left = `${event.currentTarget.offsetLeft}px`;
        setTab(parseInt(event.currentTarget.dataset.tab));
    }


    useLayoutEffect(()=>{
        console.log("Translating...")
        var tabMenu = document.getElementsByClassName("channel_tabs")[0]
        tabMenu.style.transform = `translateX(-${tabPosition}px)`;
    },[tabPosition])



    const scrollRight = (event) => {
        var tabMenu = event.currentTarget.previousElementSibling.firstChild;
        var remainingWidth = tabMenu.scrollWidth - tabMenu.clientWidth;


        if (tabPosition < remainingWidth) {
            console.log("changing scroll state...")

            setTabPosition(prevState=> prevState += 120)
        }

    }


    const scrollLeft = event => {
        var tabMenu = event.currentTarget.nextElementSibling.firstChild;
        var remainingWidth = tabMenu.scrollWidth - tabMenu.clientWidth;


        if (tabPosition > 0) {
            console.log("changing scroll state...")

            setTabPosition(prevState=> prevState -= 120)
        }
    }



    return (
        <BaseTemplate>
            <div className="channelData">
                <div style={{ backgroundImage: `url("${Banner}")`, backgroundSize:"cover", objectFit:"cover", width:"100%", height:"200px", backgroundRepeat:"no-repeat" }}></div>
                <div className="profile-info">
                    <div className="profile-pic">
                        <Avatar label="P" style={{ width:"120px", height:"120px", borderRadius:"50%", backgroundColor:"#a8a8a8", color:"#fff", fontSize:"40px", justifyContent:"center", display:"flex", alignItems:"center" }} className="mr-2" size="xlarge" shape="circle" />
                        <div className="profile-metadata">
                            <p>Prime Omondi</p>
                            <div className="profile-metrics">
                                <span>@primeomondi7654</span>
                                <span>1.47M subscribers</span>
                            </div>
                            <p>Just hanging out and talking about trending topics</p>
                        </div>
                    </div>

                    <div>
                        <Button className="subscribeBtn" variant="contained">
                            Subscribe
                        </Button>
                    </div>
                </div>
                <div className="channel_content">
                    <IconButton onClick={scrollLeft} className={tabPosition > 0 ? null : "leftScroll"} style={{ width:"50px", height:"50px", borderRadius:"50%" }}>
                        <span className="pi pi-angle-left"></span>
                    </IconButton>
                    <div className="tabWrapper">
                        <TabMenu tabMenu={tabMenu} changeActiveTab={changeActiveTab} activeTab={activeTab} />
                    </div>
                    <IconButton onClick={scrollRight} className="rightScroll" style={{ width:"50px", height:"50px", borderRadius:"50%" }}>
                        <span className="pi pi-angle-right"></span>
                    </IconButton>
                </div>
                <div className="tabContent">
                    <div className="homeContent">
                        <h3>Videos</h3>
                    </div>
                    <div className="videoContent"></div>
                    <div className="shortsContent"></div>
                    <div className="liveContent"></div>
                    <div className="podcastsContent"></div>
                    <div className="playlistsContent"></div>
                    <div className="communityContent"></div>
                    <div className="channelsContent"></div>
                    <div className="aboutContent"></div>
                </div>
            </div>
        </BaseTemplate>
    )
}


export default Channel;
