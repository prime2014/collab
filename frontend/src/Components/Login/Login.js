import React, { useRef, useState, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../../images/bg-01.jpg";
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import { accountAPI } from "../../services/account/accounts.service";
import toast, { Toaster } from "react-hot-toast";
import { userReducer } from "../../redux/reducers/reducers";
import * as actionTypes from "../../redux/actionTypes";
import cookies from "react-cookies";


const Login = props => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [disabled, setDisabled] = useState(false)
	const navigate = useNavigate()
	const [credentials, dispatch] = useReducer(userReducer)

    const changePassword = event => setPassword(event.target.value);
    const changeEmail = event => setEmail(event.target.value);

    const handleState = event => {
        if(event.target.value.length) {
            event.target.parentElement.lastChild.classList.add("persistPosition")
        } else {
            event.target.parentElement.lastChild.classList.remove("persistPosition")
        }
    }

	const setCookie = (token) => {
		const expires = new Date()
		let expiry = (Date.now() / 1000)  +  60 * 55
   		expires.setDate(expiry)
		cookies.save("access", token.access, { path: "/",  expires, maxAge: 3300 })
		cookies.save("refresh", token.refresh, { path: "/",  expires, maxAge: 6600 })
	}

	const loginUser = event => {
		event.preventDefault()
		let credentials = { email, password }
		setDisabled(true)
		toast.promise(accountAPI.login(credentials), {
			loading: "Logging you in...",
			success: (token)=> {
				setDisabled(false)
				if(token.access){
					setEmail("")
					setPassword("")
					setCookie(token)

					navigate("/rc_view")
					return "Login successful!"
				} else {
					throw token.detail;
				}
			},
			error: (error) => {
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
        <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-form validate-form" onSubmit={loginUser}>
					<span className="login100-form-title p-b-43">
						Login to continue
					</span>


					<div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input onBlur={handleState} onChange={changeEmail} ref={emailRef} className="input100" type="email" name="email" value={email}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Email</span>
					</div>


					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input onBlur={handleState} onChange={changePassword} ref={passwordRef} className="input100" type="password" name="pass" value={password}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>

					<div className="flex-sb-m w-full p-t-3 p-b-32">
						<div className="contact100-form-checkbox">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
							<label className="label-checkbox100" htmlFor="ckb1">
								Remember me
							</label>
						</div>

						<div>
							<Link to="#" className="txt1">
								Forgot Password?
							</Link>
						</div>
					</div>


					<div className="container-login100-form-btn">
						<button className="login100-form-btn">
							Login
						</button>
					</div>

					<div className="text-center p-t-46 p-b-20">
						<span className="txt2">
							or sign up using
						</span>
					</div>

					<div className="login100-form-social flex-c-m">
						<Link to="#" className="login100-form-social-item flex-c-m bg1 m-r-5">
							<GoogleIcon />
						</Link>

						<Link to="#" className="login100-form-social-item flex-c-m bg2 m-r-5">
							<TwitterIcon />
						</Link>
					</div>
				</form>

				<div disabled={disabled} className="login100-more" style={{backgroundImage: `url(${Background})`}}>
				</div>
			</div>
		</div>
	</div>
	</React.Fragment>
    )
}

export default Login;
