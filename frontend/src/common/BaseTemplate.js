import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Resumable from "resumablejs";
import Kitty from "../images/raise_kitty.webp";
import ChannelLogo from "../images/logo.jpg";
import NoContent from "../images/video-content.png";
import { postAPI } from "../services/post/post.service";
import Avatar from '@mui/material/Avatar';
import {Link} from "react-router-dom";
import { MdOutlineVideoLibrary, MdOutlineSubscriptions, MdOutlineWatchLater } from "react-icons/md";
import { GrHomeRounded } from "react-icons/gr";
import { RxVideo } from "react-icons/rx";


const BaseTemplate = props => {
    const listRef = useRef(null);
    const sidebarRef = useRef(null);


    const selectMenu = (event) => {
        const list_elements = document.getElementsByClassName("menu")
        Array.from(list_elements).forEach(item=>{
            item.classList.remove("active");
        })
        event.target.classList.add("active");
    }

    return (
        <Navbar>
            <div className="bodyTemplate">
                <ul ref={sidebarRef} className="sidebar">
                    <li className="sidebar-spacer"></li>
                    <li ref={listRef} onClick={selectMenu} className="menu active"><span><GrHomeRounded fontSize={20} style={{ verticalAlign:"center", margin:0 }} /></span> Home</li>
                    <li onClick={selectMenu} className="menu"><span><MdOutlineSubscriptions fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Subscriptions</li>
                    <li onClick={selectMenu} className="menu"><span><MdOutlineVideoLibrary fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Library</li>
                    <li onClick={selectMenu} className="menu"><span><HistoryIcon style={{ verticalAlign:"center", margin:0 }} /></span> History</li>
                    <li onClick={selectMenu} className="menu"><span><MdOutlineWatchLater fontSize={25} style={{ verticalAlign:"center", margin:0 }} /></span> Watch Later</li>
                    <li onClick={selectMenu} className="menu"><span><RxVideo fontSize={30} style={{ verticalAlign:"center", margin:0, fontSize: 25 }} /></span> Your videos</li>
                    <li onClick={selectMenu} className="menu"><span></span></li>
                </ul>

                <section>
                    {props.children}
                </section>
            </div>
        </Navbar>
    );
}



export default BaseTemplate;
