import React, { useEffect, useLayoutEffect, useState } from "react";
import StudioNavbar from "../../common/StudioNavbar";
import { Layout, Menu } from "antd";
import SourceIcon from '@mui/icons-material/Source';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import PodcastsOutlinedIcon from '@mui/icons-material/PodcastsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadVideo from "../../common/UploadVideo";
import Avatar from '@mui/material/Avatar';
import { purple } from '@mui/material/colors';
import Video from "../../images/video.jpg";
import Podcast from "../../images/podcast.png";
import GoLive from "../../images/liverry.jpg";
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TableComponent from "../../common/TableComponent";
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import { connect } from "react-redux";
import { getPrivateChannelToDispatch } from "../../redux/actionDispatch";
import { useParams } from "react-router-dom";



const Channel = props => {
    const { Header, Content, Sider } = Layout;
    const [open, setOpen] = useState(false)
    const [selector, setSelector] = useState(null)
    const [tableTabs, setTableTabs] = useState(null);
    const [firstActive, setFirstActive] = useState(1)
    const [editPost, setEditPost] = useState({})
    let { channelType, tabChoice } = useParams();


    const getItem = (label, key, icon, children, type) => {
        if(key == selector){
            return {
                className: "activeMenu",
                key,
                icon,
                children,
                label,
                type,
            }
        } else {
            return {
                className: "",
                key,
                icon,
                children,
                label,
                type,
            };
        }

    }

    useLayoutEffect(()=>{

        setSelector(channelType ? channelType.toString() : "2")
        setTableTabs(tabChoice ? tabChoice.toString() : "1")
        let channel_url = props.user.channels[0]
        props.getPrivateChannelToDispatch(channel_url)
    },[])


    const items2 = [
        getItem('Dashboard', '1', <DashboardIcon />, null),
        getItem('Content', '2', <SourceIcon/>, null),
        getItem('Analytics', '3', <AnalyticsOutlinedIcon />, null),
        getItem('Comments', '4', <CommentOutlinedIcon />, null),
        getItem('Subtitles', '5', <SubtitlesOutlinedIcon />, null),
        getItem('Copyright', '6', <CopyrightOutlinedIcon />, null),
        getItem('Podcast', '7', <PodcastsOutlinedIcon />, null),
        getItem("Monetize", '8', <AttachMoneyOutlinedIcon />, null),
        getItem("Customization", '9', <TuneOutlinedIcon />, null),
        getItem("Library", '10', <LibraryAddCheckOutlinedIcon />, null),
    ];

    const processStream = (stream, mediaSource, video) => {
        const mediaRecorder = new MediaRecorder(stream);

        console.log("called")

        const sourceOpen = () => {
            let videoBuffer = mediaSource.addSourceBuffer("video/webm;codecs=vp8");

             videoBuffer.addEventListener("updateend",() => {
              mediaSource.endOfStream();
              video.play();
              console.log(mediaSource.readyState); // ended
            })

            videoBuffer.appendBuffer(stream);
            video.addEventListener("loadedmetadata", ()=>{
                video.play()
            })
        }
        mediaSource.addEventListener('sourceopen', sourceOpen);

            // mediaRecorder.ondataavailable = (data) => {
            //     let fileReader = new FileReader();
            //     let arrayBuffer;

            //     fileReader.onloadend = () => {
            //         arrayBuffer = fileReader.result;
            //         videoBuffer.appendBuffer(arrayBuffer)
            //     }
            //     fileReader.readAsArrayBuffer(data.data);


            // }

        }



    const handleStream = async event => {
        const mediasource = new MediaSource();
        const permitMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);


        if (permitMedia) {
            const video = document.querySelector('video');

            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then((stream) =>{
                video.srcObject = stream;
                video.onloadedmetadata = ()=>{
                    video.play();
                }
            });
        }
    }

    const openModal = () => {
        setOpen(true);
        setFirstActive(1)

    }

    const openModalDetail = (row) => {
        setOpen(true)
        setFirstActive(2)
        setEditPost(row);
    }

    const activateVideoDetail = () =>{
        setFirstActive(2)
    }

    const closeVideoModal = () => setOpen(false)

    const handleSelectedMenu = ({item, key, keyPath, selectedKeys, domEvent}) => {
        setSelector(key)
        console.log(item, key, keyPath, selectedKeys)
        // domEvent.currentTarget.style.borderLeft = "4px solid crimson";
        // domEvent.currentTarget.style.color = "crimson";
        // domEvent.currentTarget.style.backgroundColor = "#f9f9f9";
    }

    const resetMenu = item => {
        console.log("DESELECT MENU")
        console.log(item)
    }

    const handleTableTabs = (event, newValue) =>{
        setTableTabs(newValue)
    }

    return (
            <React.Fragment>
            {open ? <UploadVideo editPost={editPost} activate={activateVideoDetail} active={firstActive} open={open} openModal={openModal} closeModal={closeVideoModal} /> : null}
            <StudioNavbar openModal={openModal}>
                <div className="content-template">
                    <div className="site-layout-background">
                        <div className="avatarSection">
                            <Avatar sx={{ bgcolor: purple[500], width: 120, height: 120, zIndex:"50 !important" }} >P</Avatar>
                            <p>Your channel</p>
                            <p>{ props.channel && props.channel.name }</p>
                        </div>
                        <div className="channelMenu">
                            <Menu
                                defaultActiveFirst={true}
                                activeKey={selector}
                                mode="inline"
                                defaultSelectedKeys={[selector]}
                                style={{ height: '100%', borderRight: 0, width:"100%" }}
                                items={items2}
                                onSelect={handleSelectedMenu}
                            />
                        </div>
                        <ul className="bottomLister">
                            <li><SettingsSuggestOutlinedIcon style={{ fontSize:"28px", marginRight:'13px' }}/> Settings</li>
                            <li><FeedbackOutlinedIcon style={{ fontSize:"28px", marginRight:'13px' }} /> Feedback</li>
                        </ul>
                    </div>
                    <TabContext value={selector}>
                    <TabPanel style={{ margin:"0 !important", padding:"0 !important" }} value="1">
                        <div className="channel-body">
                            <h2 style={{ fontWeight: 700 }}>Channel Content</h2>

                            <div>
                                <p style={{ fontSize:"14px", fontFamily:"Roboto", padding:"20px 0" }}>You have not created any content at the moment. Select any feature from below to get started</p>
                                <div className="create_studio">
                                    <div className="leftCard firstItem">
                                        <h3 style={{ margin:0, padding:0, lineHeight: "40px", borderBottom:"1px solid #ccc", padding:"0 10px" }}>Upload Video</h3>
                                        <div className="uploadTxt">
                                            <img src={Video} width={180} height={180} alt="video" />
                                            <p>
                                                <p>Upload video content right from your device</p>
                                                <Button variant={"contained"} onClick={()=>openModal()} startIcon={<FileUploadOutlinedIcon />}>Upload Video</Button>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="leftPanel">
                                        <div className="leftCard">
                                            <h3 style={{ margin:0, padding:0, lineHeight: "40px", borderBottom:"1px solid #ccc", padding:"0 10px" }}>Go Live</h3>
                                            <div className="uploadTxt">
                                                <img style={{ borderRadius:"50%" }} src={GoLive} width={180} height={180} alt="live" />
                                                <p>
                                                    <p>Want to go live, create a live stream and communicate with followers in real time? Get started here</p>
                                                    <Button variant={"contained"} startIcon={<SensorsOutlinedIcon />}>Get Started</Button>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="leftCard">
                                            <h3 style={{ margin:0, padding:0, lineHeight: "40px", borderBottom:"1px solid #ccc", padding:"0 10px" }}>Start a podcast</h3>
                                            <div className="uploadTxt">
                                                <img style={{ borderRadius:"50%" }} src={Podcast} width={180} height={180} alt="video" />
                                                <p><p>Create your first live podcast and directly talk to your listeners</p>
                                                    <Button variant={"contained"} startIcon={<KeyboardVoiceOutlinedIcon />}>Live Podcast</Button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel sx={{ padding:0, margin:0 }} value="2">
                        <div className="content-body">
                            <h2 style={{ fontWeight: 700, padding:"0 20px" }}>Channel Content</h2>
                            <Box sx={{ width: '78vw', margin:"20px 0" }}>
                                <TabContext value={tableTabs}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleTableTabs} aria-label="lab API tabs example">
                                        <Tab label="Videos" value="1" />
                                        <Tab label="Live" value="2" />
                                        <Tab label="Playlist" value="3" />
                                    </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <TableComponent openModal={openModalDetail} />
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <TableComponent openModal={openModalDetail}/>
                                    </TabPanel>
                                    <TabPanel value="3">
                                        <TableComponent openModal={openModalDetail}/>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </div>
                    </TabPanel>
                    </TabContext>
                </div>
            </StudioNavbar>
            </React.Fragment>
    );
}


const mapStateToProps = state => {
    return {
        user: state.userReducer.credentials,
        channel: state.channelReducer.channel
    }
}

const mapDispatchToProps = {
    getPrivateChannelToDispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
