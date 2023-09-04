import React, { useEffect, useState, useRef } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import LiveTvTwoToneIcon from '@mui/icons-material/LiveTvTwoTone';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { TfiSearch } from "react-icons/tfi"
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import cookie from "react-cookies";
import jwt_decode from "jwt-decode";
import { accountAPI } from "../services/account/accounts.service";
import { setUserCredentials } from "../redux/action";
import { connect } from "react-redux";
import { BiVideoPlus } from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { HiSignal } from "react-icons/hi2";
import { postAPI } from "../services/post/post.service";
import IconButton from '@mui/material/IconButton';
import { PiUserFocusFill } from "react-icons/pi";
import { RiLiveLine } from "react-icons/ri";
import { SlLogout } from "react-icons/sl";
import { BsDatabaseDown } from "react-icons/bs";
import { MdOutlineSettings, MdHelpOutline, MdFeedback, MdVerified, MdSwitchAccount, MdShieldMoon } from "react-icons/md";
import { IoLanguageOutline } from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";
import { createTheme, ThemeProvider } from "@mui/material/styles";



const theme = createTheme({
    palette: {
        error: {
            main: "#CC0000"
        }
    }
})


const Navbar = props => {
    const [search, setSearch] = useState([])
    const [activateSearch, setActivate] = useState(false)
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate()
    const resultRef = useRef()
    const searchRef = useRef()

    useEffect(()=> {
        window.addEventListener("click", ()=> {
            setActiveMenu(null)
        })
        console.log(props.credentials)
        const access = cookie.load("access");
        const access_decode = jwt_decode(access);
        accountAPI.fetchUserDetails(access_decode.user_id).then(resp=>{
            props.setUserCredentials(resp);
        }).catch(error=> {
            console.log(error)
        })

        return () => {
            window.removeEventListener("click", ()=> {
                setActiveMenu(null)
            })
        }
    },[])

    const showCreationMenu = event => {

        event.currentTarget.nextElementSibling.classList.toggle("hideMenu");
    }

    const handleSearch = (event) => {
        if (event.target.value.length){
            setActivate(true)
            postAPI.searchVideos(event.target.value).then(resp=>{
                setSearch(resp)
                return;
            }).catch(err=> console.log(err))
        } else {
            setActivate(false)
            setSearch([])
            return;
        }

    }

    const setSearchList = () => {
        let data = search.map(item=>{
            return (
                <li style={{ display:"flex", justifyContent:"left" }}>
                    <div style={{ backgroundColor:"#eee", display:"inline-flex", justifyContent:"center", alignItems:"center", width:"30px", height:"30px", borderRadius:"50%" }}><TfiSearch fontSize={20} style={{ verticalAlign: "middle", padding:0, margin:0 }} /></div> <span className="search-text">{item.title}</span>
                </li>
            )
        })
        return data;
    }



    const hideResults = () => {
        setActivate(false)
    }


    const showResults = () => searchRef.current.value ? setActivate(true) : null;

    const openDropdownMenu = event => {
        event.stopPropagation()
        setActiveMenu(prevState=> prevState !== "profileMenu" ? "profileMenu" : null)
    }


    const cancelPropagation = event => {
        event.stopPropagation()
    }

    const goToSettings = event => navigate("/settings/account");


    return (
        <div>
            <div className="header">
            <nav className="navigation">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <IconButton className="menu-btn" size="small" sx={{ borderRadius:"50px", width:"35px", height:"35px", backgroundColor:"none", color:"black"}}>
                        <MenuIcon style={{ fontSize: "25px" }}/>
                    </IconButton>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginLeft:"10px" }}>
                        <LiveTvTwoToneIcon style={{ fontSize: 30, color:"red" }} />
                        <span style={{ fontSize:24, fontFamily:"Poppins", fontWeight:"bold", marginLeft: 5 }}>Uncensored</span>
                    </div>
                </div>
                <form style={{ display:"flex", alignItems:"center" }}>
                    <div className="search-input">
                        <input onFocus={showResults} onBlur={hideResults} ref={searchRef} autoComplete="off" onChange={handleSearch} type="search" className="search" name="videos" placeholder="Search" spellCheck={true}/>
                        {activateSearch ?
                        (<div ref={resultRef} className={"search-results"}>

                            <ul className="result-list">
                                {search.length ? setSearchList() : <></>}
                            </ul>
                        </div>) : null}
                    </div>

                    <button style={{ borderRadius:"0 50px 50px 0", border:"none", height: 42, width: 60, backgroundColor:"#F4F4F4", display:"flex", justifyContent:"center", alignItems:"center" }}>
                        <TfiSearch fontSize={20} />
                    </button>
                </form>
                <div style={{ display:"flex", justifyContent:"right", alignItems:"center" }}>
                    <span className="dropdownCreate">
                        <IconButton onClick={showCreationMenu}>
                            <svg height="24" style={{ pointerEvents: "none", display: "block", width: "100%", height: "100%" }} viewBox="0 0 24 24"  focusable="false"><path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z"></path></svg>
                        </IconButton>

                        <ul className="hideMenu">
                            <li onClick={()=> navigate("/channel?columnType=2&tabChoice=1")}><BsUpload style={{ marginRight:"15px" }}/> Upload Video</li>
                            <li><HiSignal style={{ marginRight:"15px" }}/> Go Live</li>
                        </ul>
                    </span>
                    <span  className="rightIcons">
                    <ThemeProvider theme={theme}>
                        <Badge max={99} badgeContent={4} color="error">
                            <svg enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style={{ pointerEvents: "none", display: "block", width: "100%", height: "100%" }}><path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z"></path></svg>
                        </Badge>
                    </ThemeProvider>
                    </span>
                    <div className="profile_menu">
                        <IconButton onClick={openDropdownMenu}>
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>{(props.credentials && Object.keys(props.credentials).length) && props.credentials.first_name.charAt(0) }</Avatar>
                        </IconButton>

                        {/*dropdown menu for the avatar */}
                        {activeMenu === "profileMenu" &&
                        <div onClick={cancelPropagation} className="dropdown">
                            <div className="uc-banner">
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{(props.credentials && Object.keys(props.credentials).length) && props.credentials.first_name.charAt(0) }</Avatar>
                                <div>
                                    <p>{props.credentials.first_name} {props.credentials.last_name}</p>
                                    <p>Manage your account</p>
                                </div>
                            </div>

                            <hr />
                            <ul>
                                <li>
                                    <PiUserFocusFill style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Your Channel</span>
                                </li>
                                <li>
                                    <RiLiveLine style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Uncensored Live</span>
                                </li>
                                <li>
                                    <MdSwitchAccount style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Switch account</span>
                                </li>
                                <li>
                                    <SlLogout style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Sign out</span>
                                </li>
                            </ul>
                            <hr />

                            <ul>
                                <li>
                                    <MdVerified style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Account Verification Premium</span>
                                </li>
                                <li>
                                    <BsDatabaseDown style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Your data on Uncensored</span>
                                </li>
                            </ul>
                            <hr />

                            <ul>
                                <li>
                                    <MdShieldMoon style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Appearance: Device theme</span>
                                </li>
                                <li>
                                    <IoLanguageOutline style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Language: English</span>
                                </li>
                                <li>
                                    <CiGlobe style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Location: Kenya</span>
                                </li>
                                <li onClick={goToSettings}>
                                    <MdOutlineSettings style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Settings</span>
                                </li>
                            </ul>
                            <hr />

                            <ul>
                                <li>
                                    <MdHelpOutline style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Help</span>
                                </li>
                                <li>
                                    <MdFeedback style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: "10px" }}>Feedback</span>
                                </li>
                            </ul>
                        </div>}
                    </div>
                </div>
            </nav>
            </div>
            <div>
                {props.children}
            </div>
        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        credentials: state.userReducer.credentials
    }
}

const mapDispatchToProps = {
    setUserCredentials
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
