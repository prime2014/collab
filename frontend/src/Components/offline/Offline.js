import React from "react";
import BaseTemplate from "../../common/BaseTemplate";
import ConnectionLost from "../../images/connection.svg";

const Offline = props => {
    return (
        <BaseTemplate>
            <div className="network_wrapper">
                <div>
                    <img src={ConnectionLost} alt="connection_lost" width={120} height={120} />
                    <p>Your connection was lost</p>
                    <p>Check your network configuration and try again</p>
                </div>
            </div>
        </BaseTemplate>
    )
}


export default Offline;
