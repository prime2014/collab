import React, { useRef } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Cropper from 'cropperjs';
import Neymar from "../../images/neymar.png";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { fabric } from 'fabric';
import QuizIcon from '@mui/icons-material/Quiz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Popover from '@mui/material/Popover';
import { Link, useNavigate } from "react-router-dom";
import { accountAPI } from "../../services/account/accounts.service";
import toast, { Toaster } from "react-hot-toast";




const steps = ['Create your account', 'Upload profile image', 'Create channel'];

const Signup = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [account, setAccount] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  const [disabled, setDisabled] = React.useState(false)
  const canvasEl = useRef(null);
  const seeRef = useRef(null)
  const unseeRef = useRef(null)
  const quizRef = useRef(null)

  const passwordInputRef = useRef(null)
  const [avatar, setAvatar] = React.useState({
    avatar: {}
  })
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState(null);

  let lower = /(?<lower>[a-z]+)/g,
  upper = /(?<upper>[A-Z]+)/g,
  digits = /(?<digits>\d+)/g,
  symbol = /(?<symbol>\W+)/g

  const handleSelectAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };




  React.useEffect(() => {
    // const options = { ... };
    const canvas = new fabric.Canvas(canvasEl.current);
    // make the fabric.Canvas instance available to your app
    updateCanvasContext(canvas);
    return () => {
      updateCanvasContext(null);
      canvas.dispose();
    }
  }, []);

  const updateCanvasContext = (canvas) =>{}



  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleProfile = (event)=>{

  }

  const testPassword = (event) => {
    return (event.target.value.length >= 9 &&
           lower.test(event.target.value) &&
           upper.test(event.target.value) &&
           symbol.test(event.target.value) &&
           digits.test(event.target.value));
  }

  const setFirstname = event => setAccount({ ...account, first_name: event.target.value });
  const setLastname = event => setAccount({ ...account, last_name: event.target.value });
  const setEmail = event => setAccount({ ...account, email: event.target.value });
  const setPassword = event => {
    setAccount({ ...account, password: event.target.value });
    let validate_password = testPassword(event); // this function validate the password parameters

    if(event.target.value.length === 0) {
      quizRef.current.style.color = "#b4b4b4";
      return;
    } else if(validate_password){
      quizRef.current.style.color = "#b4b4b4";
      return;
    } else {
      quizRef.current.style.color = "crimson";
      return;
    }

  }

  const passwordAnalysis = () => {

    return (
      <React.Fragment>
        <li className={account.password.length >= 9 ? "success" : "default"}>Password must be 9 characters long</li>
        <li className={(account.password.length && upper.test(account.password)) ? "success" : "default"}>Password should contain at least one uppercase letter</li>
        <li className={(account.password.length && lower.test(account.password)) ? "success" : "default"}>Password should contain at least one lowercase letter</li>
        <li className={(account.password.length && symbol.test(account.password)) ? "success" : "default"}>Password should contain at least one symbol</li>
        <li className={(account.password.length && digits.test(account.password)) ? "success" : "default"}>Password should contain at  least one digit</li>
      </React.Fragment>
    )
  }


  const setConfirmPassword = event => {
    setAccount({ ...account, confirm_password: event.target.value });
    if(event.target.value && account.password !== event.target.value){
      event.currentTarget.style.border = "2px solid crimson";
      event.currentTarget.nextElementSibling.style.opacity = 1;
    } else {
      event.currentTarget.style.border = "1px solid #ccc";
      event.currentTarget.nextElementSibling.style.opacity = 0;
    }
  }

  const handleVisibility = event => {
    if(passwordInputRef.current.value.length < 1){
      unseeRef.current.classList.add("hideEye2");
      seeRef.current.classList.add("hideEye1");
      passwordInputRef.current.type = "password";
      return;
    }
    seeRef.current.classList.remove("hideEye1")
  }

  const handleSight = event => {
    event.currentTarget.classList.add("hideEye1");
    unseeRef.current.classList.remove("hideEye2");
    passwordInputRef.current.type = "text"
  }

  const handleBlind = event => {

    event.currentTarget.classList.add("hideEye2");
    seeRef.current.classList.remove("hideEye1");
    passwordInputRef.current.type = "password";
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const createAccount = event => {
    event.preventDefault()
    console.log(account)
    if (account.password !== account.confirm_password){
      return;
    }
    setDisabled(true)
    let { confirm_password, ...rest } = account;
    toast.promise(accountAPI.createUserAccount(rest), {
      loading: "Creating your account in a moment...",
      success: (data) => {
        setDisabled(false)
        if(data.id){

          navigate(`/account/otp/${data.id}`);
          return "Your account was successfully created"
        } else {
          let errors = Object.values(data)
          throw errors;
        }
      },
      error: (error)=>{
        setDisabled(false)
        return error;
      }
    }, {
      style: {
        backgroundColor: "#5bc0de",
        lineHeight: "25px",
        color: "#fff",
        borderRadius: "50px"
      }
    })

  }

  return (
    <React.Fragment>
      <Toaster />
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", height:"100vh", backgroundColor:"#F3F3F3" }}>
            <div className="signupWrapper" style={{ fontFamily:"Roboto" }} >
                <form className={activeStep + 1 == 1 ? "showContent" : "hideContent"}>
                    <h2 style={{ fontFamily:"Poppins", fontWeight: 700 }}>CREATE ACCOUNT</h2>
                    <div className="accountContent" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                        <label>First name*</label>
                        <input onChange={setFirstname} type="text" name="firstname" value={account.first_name} placeholder="e.g John"/>
                        </div>

                        <div>
                        <label>Last name*</label>
                        <input onChange={setLastname} type="text" name="lastname" value={account.last_name} placeholder="e.g Henry"/>
                        </div>
                    </div>

                    <div className="accountSetup">
                        <div>
                        <label>Email*</label>
                        <input onChange={setEmail} type="email" name="email" value={account.email} placeholder="example@gmail.com"/>
                        </div>
                    </div>

                    <div className="passwordSetup">
                        <div className="setPassword">
                            <label>Password*</label>
                            <input required minLength={9} ref={passwordInputRef} onInput={handleVisibility} onChange={setPassword} type="password" name="password" value={account.password} placeholder="Enter your password"/>
                            <QuizIcon ref={quizRef} onClick={handleSelectAnchor} style={{ position:"absolute", bottom:"10px", right:-10, color:"#b4b4b4", cursor:"pointer" }}/>
                            <VisibilityIcon onClick={handleSight} ref={seeRef} className="hideEye1" style={{ position:"absolute", bottom:"10px", right:15, cursor:"pointer" }}/>
                            <VisibilityOffIcon onClick={handleBlind} ref={unseeRef} className="hideEye2" style={{ position:"absolute", bottom:"10px", right:15, cursor:"pointer" }}/>
                            <Popover
                              id={id}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                            >
                              <Typography sx={{ p: 2 }} style={{ fontSize:14 }}>
                                <p style={{ padding:0, margin:0, fontFamily:"Roboto", fontWeight:900 }}>Your password must fulfill these requirements:</p>
                                <ul style={{ margin:"5px 0", padding:"0 10px", fontSize:12, fontWeight:500 }}>
                                  {passwordAnalysis()}
                                </ul>
                              </Typography>
                            </Popover>
                        </div>

                        <div style={{ marginTop:20 }}>
                            <label>Confirm Password*</label>
                            <input required minLength={9} onChange={setConfirmPassword} type="password" name="confirm_password" value={account.confirm_password} placeholder="Please confirm your password"/>
                            <span style={{ padding:"0 10px", opacity: 0, color:"crimson", display:"block", fontFamily:"Roboto", fontSize:"12px", fontWeight:"bold", lineHeight:"20px" }}>Your passwords do not match!</span>
                        </div>
                        <div>
                          <p style={{ fontWeight:"bold", fontSize:"14px", margin:0, padding:"0 5px", lineHeight:"20px" }}>Already have an account? <Link style={{ textDecoration:"none", color:"#065fd4" }} to={"/account/login"}>Sign in</Link></p>
                          <Button onClick={createAccount} disabled={disabled} style={{ marginTop:10 }} variant="contained">Create Account</Button>
                        </div>
                    </div>

                </form>
                <div className="circleDesign1"></div>
                <div className="circleDesign2"></div>
            </div>
    </div>
    </React.Fragment>
  );
}

export default Signup;
