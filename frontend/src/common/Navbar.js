import React, { useEffect, useState, useCallback, useRef } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import LiveTvTwoToneIcon from '@mui/icons-material/LiveTvTwoTone';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TfiSearch } from "react-icons/tfi"
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Badge from '@mui/material/Badge';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
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


const Navbar = props => {
    const [search, setSearch] = useState([])
    const [activateSearch, setActivate] = useState(false)
    const navigate = useNavigate()
    const resultRef = useRef()
    const searchRef = useRef()

    useEffect(()=> {
        console.log(props.credentials)
        const access = cookie.load("access");
        const access_decode = jwt_decode(access);
        accountAPI.fetchUserDetails(access_decode.user_id).then(resp=>{
            props.setUserCredentials(resp);
        }).catch(error=> {
            console.log(error)
        })
    },[])

    const showCreationMenu = event => event.currentTarget.nextElementSibling.classList.toggle("hideMenu");

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
                <li style={{ display:"flex", justifyContent:"left" }}><div style={{ backgroundColor:"#eee", display:"inline-flex", justifyContent:"center", alignItems:"center", width:"30px", height:"30px", borderRadius:"50%" }}><TfiSearch fontSize={20} style={{ verticalAlign: "middle", }} /></div> <span className="search-text">{item.title}</span></li>
            )
        })
        return data;
    }



    const hideResults = () => {
        setActivate(false)
    }

    const showResults = () => searchRef.current.value ? setActivate(true) : null;


    return (
        <div>
            <div className="header">
            <nav className="navigation">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <MenuIcon style={{ fontSize:30 }}/>
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
                <div style={{ display:"flex" }}>
                    <span className="dropdownCreate">
                        <span className="rightIcons" onClick={showCreationMenu}>
                        <BiVideoPlus style={{ fontSize:23 }} />
                        </span>
                        <ul className="hideMenu">
                            <li onClick={()=> navigate("/channel?columnType=2&tabChoice=1")}><BsUpload style={{ marginRight:"15px" }}/> Upload Video</li>
                            <li><HiSignal style={{ marginRight:"15px" }}/> Go Live</li>
                        </ul>
                    </span>
                    <span className="rightIcons">
                    <Badge badgeContent={4} color="error">
                        <NotificationsNoneOutlinedIcon style={{ fontSize: 20 }} />
                    </Badge>
                    </span>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>{(props.credntials && props.credentials.values()) && props.credentials.first_name.charAt(0) }</Avatar>
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
