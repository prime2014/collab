import React from "react";
import Navbar from "./Navbar";




const SettingsTemplate = props => {
    return (
        <Navbar>
            <div className="settings">
                <ul>
                    <li className="headline">Settings</li>
                    <li>Account</li>
                    <li>Notifications</li>
                    <li>Playback</li>
                    <li>Payment & Subscription</li>
                    <li>Ads & Revenue</li>
                    <li>Access & Permissions</li>
                    <li>System Preferences</li>
                    <li className="deleteAction">Delete Account</li>
                </ul>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </Navbar>
    );
}


export default SettingsTemplate;

