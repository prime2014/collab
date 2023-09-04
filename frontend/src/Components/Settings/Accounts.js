import React, { useRef, useState } from "react";
import SettingsTemplate from "../../common/SettingsTemplate";
import { Avatar } from 'primereact/avatar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { PrimeReactContext } from 'primereact/api';
import { Link } from "react-router-dom";
import Credentials from "../../images/credentials.webp";
import { MdModeEditOutline } from "react-icons/md";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Accounts = props => {

    const [open, setOpen] = useState(false);
    const op = useRef(null);


    const toggleChannelMenu = event => op.current.toggle(event);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <Dialog style={{ padding:"0 20px" }} open={open} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
            <SettingsTemplate>
                <div className="account">
                    <h2 style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>Accounts <span style={{ fontSize:"14px" }}>Signed in as omondiprime@gmail.com</span></h2>
                    <p className="descriptionSettings">These settings affect the personal account you signed up with and the channels you created</p>
                    <hr />

                    <div className="uc-channel-utilities">
                        <h3>Your Uncensored Channels</h3>
                        <p>You need a channel to upload your own videos, comment on videos and create playlists</p>
                        <p style={{ color:"darkslateblue" }}><strong>You can create up to three channels</strong></p>

                        <div className="channelAction">
                            <h4>Your Default Channel</h4>
                            <Button style={{ borderRadius:"50px", color:"black" }} variant="text" onClick={toggleChannelMenu}>
                                <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
                                    <Avatar label="P" style={{ width:"45px", height:"45px", borderRadius:"50%", backgroundColor:"green", color:"#fff", fontSize:"20px", justifyContent:"center", display:"flex", alignItems:"center" }} className="mr-2" size="xlarge" shape="circle" />
                                    <span style={{ display:"flex", justifyContent:"center", alignItems:"center", fontWeight:"bold", display:"inline-block", marginLeft:"10px" }}>Prime Omondi <ArrowDropDownIcon style={{ padding:0, margin:0, verticalAlign:"middle" }} /></span>
                                </div>
                            </Button>
                            <OverlayPanel ref={op} className="overlaypanel-demo">
                                <div style={{ fontSize:"12px", lineHeight:"25px", padding:"0 10px" }}>Select a default channel <Link to="#">learn more</Link></div>
                                <ul>
                                    <li><span>Prime Channel 2</span> <span className="pi pi-check checkmark"></span></li>
                                    <li><span>Prime Channel 3</span></li>
                                </ul>
                            </OverlayPanel>
                        </div>
                    </div>
                    <hr />

                    <div>
                        <h3>Account Details</h3>
                        <div className="account_details">
                            <div>
                                <p><strong>Firstname:</strong> Prime</p>
                                <p><strong>Lastname:</strong> Omondi</p>
                                <p><strong>Email:</strong> omondiprime@gmail.com</p>
                                <p><strong>Date Joined:</strong> 11/12/2021</p>
                                <Button onClick={handleClickOpen} variant="contained" color="secondary" startIcon={ <MdModeEditOutline /> }>Edit</Button>
                            </div>
                            <div>
                                <img src={Credentials} width={300} height={250} alt="credentials" />
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsTemplate>
        </React.Fragment>
    )
}


export default Accounts;
