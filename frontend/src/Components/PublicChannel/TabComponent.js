import React from "react";
import Button from '@mui/material/Button';


const TabMenu = ({ tabMenu, changeActiveTab, activeTab, ...props }) => {
    return (
        <ul className="channel_tabs">
            {tabMenu.map((item, index, array)=> {
                return (
                    <li key={index} onClick={changeActiveTab} data-tab={index} className={activeTab === index && "active_tab"}>
                        <Button style={{ width:"100%", color:"#8a8a8d", fontWeight:"bold", lineHeight:"40px" }} variant="text">
                            {item}
                        </Button>
                    </li>
                )
            })}
            <li className="search_tab">
                {/* The search form */}
                <form>
                    <input style={{ minWidth:"240px", padding:"0 5px", fontSize:"15px", color:"#8A8A8D", lineHeight:"40px", border:"none", fontWeight:"bold", backgroundColor:"#EAEAED", fontFamily:"Roboto", outline:"none" }} type="search" name="channel" placeholder="Search videos" />
                </form>
            </li>
            <li id="presentation_layer"></li>
        </ul>
    )
}


export default TabMenu;
