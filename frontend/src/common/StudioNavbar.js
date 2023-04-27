import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import LiveTvTwoToneIcon from '@mui/icons-material/LiveTvTwoTone';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Badge from '@mui/material/Badge';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Layout } from "antd";
import { TfiUpload } from "react-icons/tfi";
import { HiSignal } from "react-icons/hi2";



const StudioNavbar = props => {


    const showCreationMenu = event => event.currentTarget.nextElementSibling.classList.toggle("hideMenu");

    return (
        <div className="templateChannel">
            <nav className="studioNavbar">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginLeft:"20px" }}>
                    <MenuIcon style={{ fontSize:30 }}/>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginLeft:"10px" }}>
                        <LiveTvTwoToneIcon style={{ fontSize: 30, color:"red" }} />
                        <span style={{ fontSize:24, fontFamily:"Poppins", fontWeight:"bold", marginLeft: 5 }}>Uncensored</span>
                    </div>
                </div>
                <form style={{ display:"flex", alignItems:"center" }}>
                    <input type="search" name="videos" placeholder="Search" style={{ lineHeight: "35px", width:"32vw", border:"2px solid #d4d4d4", paddingLeft:"10px", outline:"none" }}/>
                </form>
                <div style={{ display:"flex", alignItems:"center", marginRight:"20px" }}>
                    <span className="dropdownCreate">
                        <button className="createButton" onClick={showCreationMenu}>
                        <VideoCallOutlinedIcon style={{ fontSize:25, color:"crimson" }} /> create
                        </button>
                        <ul className="createList hideMenu">
                            <li onClick={()=>props.openModal()}><TfiUpload style={{ marginRight:"15px" }}/> Upload Video</li>
                            <li><HiSignal style={{ marginRight:"15px" }}/> Go Live</li>
                            <li><PlaylistAddIcon style={{ marginRight:"15px" }}/> New Playlist</li>
                        </ul>
                    </span>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>P</Avatar>
                </div>
            </nav>
            <div>
                {props.children}
            </div>
            </div>

    );
}

export default StudioNavbar;
