import { PathMotionPlugin } from "rc-tween-one";
import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import LiveLogo from "../../images/livestream.gif";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = props => {

    const el = React.useRef(null);
    const navigate = useNavigate()
  // Create reference to store the Typed instance itself
	const typed = React.useRef(null);

    const list = {
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.3,
            staggerDirection: 1
          },
        },
        hidden: {
          opacity: 0,
          transition: {
            when: "afterChildren",
          },
        },
    }

    const item = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 },
    }

    useEffect(()=>{
        const options = {
            strings: [
            'videos',
            'Livestream',
            'channel'
          ],
          typeSpeed: 80,
          backSpeed: 50,
        };

        console.log("Hello")

        typed.current = new Typed(el.current, options);

        return ()=>{
            typed.current.destroy();
        }
    }, [])

    return (
        <React.Fragment>
        <div className="homeBanner">
            <div className="bannerText">
                <div className="mynav">
                    <img src={LiveLogo} className="logoBanner" alt="logo" width={100} height={50}/>

                    <ul className="homeMenu">
                        <li>How To</li>
                        <li>Services</li>
                        <li>Terms & Conditions</li>
                        <li onClick={()=>navigate("/account/signup")}>Sign up</li>
                    </ul>
                </div>
                <div className="maintext">
                    <div>
                        <h1>Create your own <span style={{ color:"crimson" }} ref={el}>Livestream</span></h1>
                        <p>You can create your own experience at the click of a button. Monetize your work and share with the world!</p>
                    </div>
                </div>
            </div>

        </div>
        <div className="services">
            <div className="textServices">
                <motion.h1 style={{ textAlign:"center", fontFamily:"Poppins", color:"white", fontWeight:"bold", zIndex:150 }} initial={{ opacity: 0 }} whileInView={{ opacity:1, transition: { duration:1.5 } }}>
                    We offer the following services
                </motion.h1>

                <motion.ul
                    initial="hidden"
                    whileInView={{ ...list, transition: { duration:1.5 } }}
                    variants={list}
                >
                    <motion.li style={{ color:"white" }} variants={item}>Podcast</motion.li>
                    <motion.li style={{ color:"white" }} variants={item}>Livestream</motion.li>
                    <motion.li style={{ color:"white" }} variants={item}>Channel</motion.li>
                </motion.ul>
            </div>

        </div>
        </React.Fragment>
    )
}

export default Home;
