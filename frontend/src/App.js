import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import VideoList from "./Components/VideoList/VideoList";
import Channel from "./Components/Channel/Channel";
import Signup from "./Components/Signup/Signup";
import OTPCode from "./Components/otp/OTPCode";
import Login from "./Components/Login/Login";
import VideoDetail from "./Components/VideoDetail/VideoDetail";
import FetchVideos from "./Components/VideoList/FetchVideos";
import Offline from "./Components/offline/Offline";
import PublicChannel from "./Components/PublicChannel/Channel";
import Accounts from "./Components/Settings/Accounts";
import ProtectedRoute from "./common/ProtectedRoute";



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/"} element={ <Home /> } />
          <Route path={"/offline"} element={<Offline />} />
          <Route element={ <ProtectedRoute /> } >
            <Route index path={"/rc_view"} element={ <FetchVideos /> } />
          </Route>
          <Route path={"/channel"} element={ <Channel /> } />
          <Route path={"/:channelName"} element={ <PublicChannel/> } />
          <Route path={"/account/signup"} element={<Signup />} />
          <Route path={"/account/otp/:user_id"} element={<OTPCode />} />
          <Route path={"/account/login"} element={<Login />} />
          <Route path={"/channel/:channel_id/video/:video_id"} element={ <VideoDetail /> } />
          <Route path={"/settings/account"} element={<Accounts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
