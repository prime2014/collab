import React, { useState, useCallback, useEffect } from "react";
import Verify from "../../images/illustrate.png";
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { accountAPI } from "../../services/account/accounts.service";
import toast, { Toaster } from "react-hot-toast";



const OTPCode = props => {

    const [inputs, setInputs] = useState({
        first: "",
        second: "",
        third: "",
        fourth: "",
        fifth: "",
        sixth: "",
    })
    const [disabled, setDisabled] = useState(false)
    const [resend, setResend] = useState(false)
    const [baseInputs] = useState(inputs)
    const [account, setAccount] = useState({
        first_name: "",
        last_name: "",
        email: ""
    })
    let { user_id } = useParams();

    const isDisabled = useCallback(()=>{
        return Object.values(inputs).some(value=> isNaN(parseInt(value)))
    },[inputs])

    useEffect(()=>{
        accountAPI.fetchUserDetails(user_id).then(resp=>{
            setAccount({
                first_name: resp.first_name,
                last_name: resp.last_name,
                email: resp.email
            })
        }).catch(error=>{
            console.log(error)
        })
    },[user_id])


    const handleNumbers = event =>{

        let last_child = event.target.parentElement.lastChild;
        setInputs({ ...inputs, [event.target.name]: event.target.value })
        event.currentTarget.classList.remove("error")

        if(event.target.value.length === 1 && event.target !== last_child){
            event.target.setAttribute("tabindex", -1)
            event.target.nextElementSibling.setAttribute("tabindex", 0)
            event.target.nextElementSibling.focus()
        }
    }

    const sendOTPCode = event => {
        let { ...rest } = inputs;
        let token = Object.values(rest).join("")
        setDisabled(true)
        toast.promise(accountAPI.activateAccount(user_id, token), {
            loading: "Activating your account...",
            success: (data)=> {
                setDisabled(false)
                if(data.id){
                  setInputs(baseInputs)
                  return "Your account was successfully activated"
                } else {
                    throw data.error;
                }

            },
            error: (error) => {
                setDisabled(false)
                return error;
            }
        }, {
            style: {
                backgroundColor: "#5bc0de",
                lineHeight: "20px",
                color: "#fff",
                borderRadius: "50px"
            }
        })
    }

    const resendVerificationOTP = () => {
        setResend(true)
        toast.promise(accountAPI.resendVerificationEmail(parseInt(user_id)), {
            loading: "resending otp to your email address",
            success: (data)=>{
                setResend(false)
                if(data.sent){
                    return data.sent
                } else {
                    throw data;
                }
            },
            error: (error)=>{
                setResend(false)
                return error;
            }
        }, {
            style: {
                backgroundColor: "#5bc0de",
                lineHeight: "20px",
                color: "#fff",
                borderRadius: "50px"
            }
        })
    }


    return(
        <React.Fragment>
            <Toaster />
        <div style={{ backgroundColor:"#F3F3F3", width:"100%", height:"100vh", display:'flex' }}>
            <div style={{ width:"25vw", height:"100%", padding:"0 30px", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"lightblue" }}>
                <img src={Verify} width={400} height={440} style={{ objectFit:"cover" }} alt="verify" />
            </div>
            <div className="otpTemplate">
                <p style={{ lineHeight:"50px", fontSize:30 }}>Hello {account.first_name} {account.last_name}</p>
                <p style={{ lineHeight:"30px" }}>We have sent you an email on this address <strong>{account.email}</strong> containing a One Time Password. In order to activate your account, type that code on the input fields below</p>
                <p style={{ lineHeight:"30px", fontSize:"14px" }}><strong>NOTE: The OTP code is only valid for 10 minutes after which it will be invalidated</strong></p>
                <div style={{ margin:"60px 0" }}>
                    <p style={{ margin:"25px 0", fontSize:"25px", color: "#74acbe", textAlign:"center" }}>ENTER THE OTP CODE</p>
                    <div className="otpVerify">
                        <input onChange={handleNumbers} autoFocus tabIndex={0} name="first" minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.first} />
                        <input tabIndex={-1} name="second" onInput={handleNumbers}  minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.second} />
                        <input tabIndex={-1} name="third" onInput={handleNumbers}  minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.third} />
                        <input tabIndex={-1} name="fourth" onInput={handleNumbers}  minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.fourth} />
                        <input tabIndex={-1} name="fifth" onInput={handleNumbers}  minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.fifth} />
                        <input tabIndex={-1} name="sixth" onInput={handleNumbers}  minLength={1} maxLength={1} pattern="[0-9]{1}" type="text" value={inputs.sixth} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"center", padding:"20px 0" }}>
                       <Button onClick={sendOTPCode} disabled={isDisabled() || disabled} size="small" style={{ margin:"0 auto" }} variant="text">Verify Code</Button>
                    </div>
                </div>
                <div>
                    <p style={{ margin:0, padding:0, fontSize: "13px", textAlign:"center" }}>You may have to check your spam if you did not receive the email in your inbox</p>
                    <p style={{ margin:0, padding:0, fontSize: "13px", textAlign:"center" }}>Did not receive the email? <Button disabled={resend} variant="text" onClick={resendVerificationOTP}>Resend code</Button></p>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

export default OTPCode;
