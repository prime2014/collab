import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Link, useParams } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Button from '@mui/material/Button';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Resumable from "resumablejs";
import LinearProgress from '@mui/material/LinearProgress';
import PublishIcon from '@mui/icons-material/Publish';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import cookie from "react-cookies";
import { postAPI } from '../services/post/post.service';
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';
import ContentLoader from "react-content-loader";
import { ProgressSpinner } from 'primereact/progressspinner';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Modal } from 'antd';
import { Tooltip } from "primereact/tooltip";
import { connect } from 'react-redux';
import { createPost } from '../redux/actionDispatch';





const steps = [
  'Details',
  'Video Elements',
  'Checks',
  'Visibility'
];

function HorizontalLabelPositionBelowStepper() {
  return (
    <Box sx={{ width: '100%', height:"10vh", margin:"13px 0" }}>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const UploadVideo = (props) => {
  const [open, setOpen] = React.useState(false);
  const [fileerror, setFileError] = React.useState(false)
  const fileRef = React.useRef(null);
  const inputFormRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const uploadTrigger = React.useRef(null)
  const descriptionRef = React.useRef(null);
  const [post,setPost] = React.useState({
    title: "",
    description: ""
  })
  const [imageUrl, setImageUrl] = React.useState("");
  const [uploadloader, setUploadLoader] = React.useState(false)
  const [video, setVideo] = React.useState("")

  const videoRef = React.useRef(null);
  const thumbRef = React.useRef(null);
  const thumbRef2 = React.useRef(null);
  const [selectedThumbnail, setSelectedThumbnail] = React.useState(2)
  const [progress, setProgress] = React.useState(0)
  const [token, setToken] = React.useState("")
  const [mypost, setMyPost] = React.useState({})
  const [disabled, setDisabled] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState("")
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const overlayRef = React.useRef();
  const [messageApi, contextHolder] = message.useMessage()


  React.useLayoutEffect(()=>{
    if(Object.keys(props.editPost).length){
      setMyPost(props.editPost)
    }

  },[])


  // let uploader = new Resumable({
  //   target: process.env.REACT_APP_API_URL + "/posts/upload/",
  //   chunkSize: 3000000,
  //   query: { upload_token: token },
  //   headers: {
  //     "Authorization": `Bearer ${cookie.load("access")}`
  //   },
  //   uploadMethod: "POST",
  //   simultaneousUploads: 1
  // })


  const getVideoToken = (file) => {
    axios.get(process.env.REACT_APP_API_URL + "/posts/token/", {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${cookie.load('access')}`
      }
    }).then(resp=>{
      let { data } = resp;
      console.log(data.token)
      setToken(data.token);
      setVideo(file)
      setFileError(false)
      uploadVideoFile(file, data.token)
    }).catch(error=>{
      return error.response.data;
    })
  }


  const handleClickOpen = () => {
    props.openModal()
  };
  const handleClose = () => {
    props.closeModal()
  };

const handleFileUpload = () => {
  fileRef.current.click()
}



const checkFileType = (file) => {

  let mimetypes = ["video/x-flv", "video/mp4", "application/x-mpegURL", "video/MP2T", "video/3gpp", "video/quicktime", "video/x-msvideo,video/x-ms-wmv"]

  if(mimetypes.includes(file.type)){
      getVideoToken(file)
  } else {
    console.log("Invalid file type");
    setFileError(true)
    inputFormRef.current.reset()
  }
}

const handleFile = event => {
  checkFileType(event.target.files[0]);
}

const errorMessage = () =>{
  return (
    <span style={{ display:"flex", alignItems:"center" }}><ErrorOutlinedIcon style={{ color:"crimson", fontSize:"15px", marginRight:"5px" }} /> Invalid file type</span>
  )
}

const handleDragEnter = event => {
  event.preventDefault()
  console.log("Mouse has entered")
  event.currentTarget.classList.add("dashed")
}

const handleDragOver = event => {
  event.preventDefault()
}


const displayVideo = file => {
  let video_file = URL.createObjectURL(file)
  let video = document.getElementsByTagName("video")[0]
  videoRef.current.src = video_file
  video.onload = () => URL.revokeObjectURL(videoRef.src);
}

const handleDropFile = event => {
  event.preventDefault()
  console.log("DROPPED A FILE:", event.dataTransfer.files)
  event.currentTarget.classList.remove("dashed")
  fileRef.current.files = event.dataTransfer.files;
  checkFileType(event.dataTransfer.files[0])
}

const resetDropField = event => {
  event.currentTarget.classList.remove("dashed")
}

const handleTitle = event => {
  if(Object.keys(mypost).length){
    setMyPost({ ...mypost, title: event.target.value })
  } else {
    setPost({...post, title: event.target.value});
  }
}

const handleDescription = event => {
  if(Object.keys(mypost).length){
    setMyPost({ ...mypost, description: event.target.value })
  } else {
    setPost({...post, description: event.target.value});
  }
}

const handleFocus = event => {
  event.target.previousElementSibling.style.color = "#065fd4";
  event.target.parentElement.classList.remove("errorHighlight");
  event.target.parentElement.classList.add("wrapperHighlight");
}

const handleBlur = event => {
  event.target.previousElementSibling.style.color = "#000000";
  event.target.parentElement.classList.remove("wrapperHighlight");
}

const uploadVideo = (event) => {
  event.preventDefault();

}





const paintVideo = React.useCallback(()=>{
  return video ? URL.createObjectURL(video) : null;
},[video])


// const uploadVideoFile = (file) => {

//   const firstDiv = document.getElementsByClassName("troller")[0];
//   const secondDiv = document.getElementsByClassName("slayer")[0];

//   let uploader = new Resumable({
//     target: process.env.REACT_APP_API_URL + "/posts/upload/",
//     chunkSize: 3000000,
//     query: { upload_token: token },
//     headers: {
//       "Authorization": `Bearer ${cookie.load("access")}`,
//       "X-CSRFToken": `${cookie.load("csrftoken")}`
//     },
//     uploadMethod: "POST",
//     simultaneousUploads: 1
//   })


//   uploader.addFile(file);

//   console.log(uploader)

//     uploader.on("fileAdded", (file, event)=>{
//       uploader.upload()
//     })

//     uploader.on("fileSuccess", (file, message)=>{
//       console.log("THIS IS FILE: ", file)
//       console.log("THIS IS MESSAGE: ", typeof message)
//       let post = JSON.parse(message)
//       setMyPost(post)
//       setTimeout(()=>{
//         props.activate()
//       },3000)
//     })

//     uploader.on("progress", (file, message)=>{

//       setProgress(uploader.progress() * 100)
//     })
// }

  const uploadVideoFile = async (file, token) => {
    const firstDiv = document.getElementsByClassName("troller")[0];
    const secondDiv = document.getElementsByClassName("slayer")[0];
    let formData = new FormData()
    const url = process.env.REACT_APP_API_URL + `/posts/upload/?upload_token=${token}`;
    let post = null;

    formData.append("file", file)

    // axios request to upload a video file
    try {
        let response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${cookie.load("access")}`,
                "X-CSRFToken": `${cookie.load("csrftoken")}`
            },
            onUploadProgress: (progressEvent) => {
              var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setProgress(percentCompleted)
            }
        });
        props.activate()
        if (response) post = response.data;
        setMyPost(post)
        return post;
    } catch(error){
       return error.response.data;
    }
  }

  const publishVideo = event => {
    if(!titleRef.current.value) {
      titleRef.current.previousElementSibling.style.color = "#dc143c";
      titleRef.current.parentElement.classList.add("errorHighlight");
      return;
    } else if(Object.keys(mypost).length){

      let { id, title, description } = mypost;

      let image = selectedThumbnail === 1 ? matchURLString(imageUrl) : null;


      setDisabled(true)
      let data = selectedThumbnail === 1 ? {id, title, description, pic:image} : {id, title, description }

      // logic for creating the post
      props.createPost(data).then(resp=>{
        setDisabled(false);
        setMyPost({})
        messageApi.open({
          type:"success",
          content:"Post was successfully created"
        })
        handleClose()
      }).catch(err=>{
        setDisabled(false)
        messageApi.open({
          type: "error",
          content: "There was a problem creating your post. Try again later"
        })
      })

    } else {
        let { id, title, description } = post;
    }
  }


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };


  const handleChange = (info) => {

    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {

      getBase64(info.file.originFileObj, (url) => {
        // console.log("URL OF FILE:", url)

        setLoading(false);
        setImageUrl(info.file.response.url);

        let matched = matchURLString(info.file.response.url)
        if(matched) {
          console.log(matched)

        }
        setSelectedThumbnail(1);
      });
    }
  };


  const beforeUpload = (file) => {
    console.log(file)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type == "image/webp";
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/WEBP file!');
    }

    return isJpgOrPng;
  };


  const uploadButton = (
    <div className="trigger-upload">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>
        Upload
      </div>
    </div>
  );

  const handlePreview = (event) => {
    console.log("I have been clicked")
    event.stopPropagation();
    setPreviewOpen(true)
    setPreviewImage(imageUrl)
  }

  const handleCancel = () => {
    setPreviewOpen(false)
    setPreviewImage("")
  }


  // Thumbnail selector when user does not explicitly upload a video thumbnail
  const selectThumbnail = event => setSelectedThumbnail(parseInt(event.target.dataset.thumbnail));

  // natch url string and modify it
  const matchURLString = (url) => {
    const re = new RegExp(/http:\/\/\d{3}\.\d{1}\.\d{1}\.\d{1}:\d{4}\/media\//)

    let result = url.match(re)
    if (result[0]) {
      let matched = url.replace(result[0], "")
      return matched;
    } else {
      return
    }
  }




  return (
    <div>
      {contextHolder}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        maxWidth={"md"}

      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Upload Videos
        </BootstrapDialogTitle>

        <DialogContent dividers sx={{overflowY:"hidden"}}>
        <div style={{ position:"relative", overflowX:"hidden", overflowY:"hidden", height:"70vh"}}>
         {uploadloader ? <LinearProgress /> : null}
         {props.active === 1 ?
         <div className='troller' onDragLeave={resetDropField} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDropFile} style={{ height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={140} value={progress} variant={"determinate"}/>
                <div className="loaderWrapped">
                  <FileUploadIcon style={{ fontSize:"90px", position:"absolute", transform:"translateX(13%) translateY(15%)", zIndex:500 }}/>
                </div>
              </Box>
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"30px"}}>
                <p style={{ fontSize:"14px", fontWeight:700, padding:0, margin:0, lineHeight:"30px" }}>Drag and Drop video files to upload</p>
                <p style={{ fontSize:"13px", color:"#999", padding:0, margin:0, lineHeight:"20px" }}>Your videos will be private until you publish them</p>
                <p style={{ textAlign:"center", lineHeight:"30px",  fontSize:"13px", fontWeight:"bold", color:"darkslateblue", fontFamily:"Roboto" }}>{progress > 0 ? `Uploading: ${parseFloat(progress).toFixed(1)}%` : null}</p>
                <Button variant="contained" style={{ margin:"10px 0" }} ref={uploadTrigger} onClick={handleFileUpload}>SELECT FILES</Button>
                <form style={{ width:"1px", height:"1px" }} ref={inputFormRef} onSubmit={(event)=> event.preventDefault()}>
                  <input style={{ width:"1px", height:"1px" }} onChange={handleFile} ref={fileRef} type="file" name="video" accept='video/x-flv, video/mp4, application/x-mpegURL, video/MP2T, video/3gpp, video/quicktime, video/x-msvideo,video/x-ms-wmv' />
                </form>
                <p style={{ margin:0, padding:0, lineHeight:"30px", fontSize:"13px", fontFamily:"Poppins", fontWeight:700 }}>{fileerror ? errorMessage() : ""}</p>
              </div>
          </div> :

          <div className="slayer">

            <div style={{ width:"60%" }}>
              <h3 style={{ fontFamily:"Open Sans" }}>Details</h3>
              <div className="textWrapper">
                <p style={{ padding:"3px 10px", margin:0, lineHeight:"20px", fontFamily:"Roboto", fontWeight:600, fontSize:"13px" }}>Title (required)</p>
                <textarea required value={Object.keys(mypost).length && mypost.title} onFocus={handleFocus} onBlur={handleBlur} onChange={handleTitle} ref={titleRef} maxLength={100} cols={30} rows={5} style={{resize:"none", display:"block", width:"calc(100% - 20px)", outline:"none", fontFamily:"Roboto", fontWeight:400, height:"60px", padding:"5px 10px", fontSize:"14px", border:"none" }} placeholder="Add a title that describes your video"></textarea>
                <div style={{ textAlign:"right", padding:"5px 10px" }}><span style={{ margin:0, fontFamily:"Roboto", fontWeight:600, fontSize:"12px" }}>{Object.keys(mypost).length ? mypost.title.length : post.title.length}/100</span></div>
              </div>

              <div className="textWrapper">
                <p style={{ padding:"3px 10px", margin:0, lineHeight:"20px", fontFamily:"Roboto", fontWeight:600, fontSize:"13px" }}>Description</p>
                <textarea value={Object.keys(mypost).length && mypost.description} onFocus={handleFocus} onBlur={handleBlur} onChange={handleDescription} ref={descriptionRef} maxLength={400} cols={30} rows={10} style={{resize:"none", display:"block", width:"calc(100% - 20px)", outline:"none", fontFamily:"Roboto", fontWeight:400, height:"100px", padding:"5px 10px", fontSize:"14px", border:"none" }} placeholder="Tell viewers about your video"></textarea>
                <div style={{ textAlign:"right", padding:"5px 10px" }}><span style={{ margin:0, fontFamily:"Roboto", fontWeight:600, fontSize:"12px" }}>{Object.keys(mypost).length ? mypost.description.length : post.description.length}/400</span></div>
              </div>

              <div style={{ fontFamily:"Roboto" }}>
                <h4 style={{ margin:0, padding:0, lineHeight:"30px" }}>Thumbnail</h4>
                <p style={{ fontSize:"13px" }}>Select or upload a picture that shows what's in your video.
                  A good thumbnail stands out and draws viewers' attention. Learn more</p>
                <div className='thumbnailWrapper'>
                  <div className="uploader-wrapper">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    action={`http://127.0.0.1:8000/api/posts/v1/videos/${mypost.id}/thumbnail/`}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    method="post"
                    headers={{
                      "Authorization": `Bearer ${cookie.load("access")}`,
                      "X-CSRFToken": `${cookie.load("csrftoken")}`
                    }}
                  >
                    {imageUrl ? (
                        <div>
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                            display:'block',
                            width: '100%',
                            objectFit:"cover",
                            height:"120px"
                          }}
                        />
                        </div>
                      ) : (
                        uploadButton
                    )}
                  </Upload>
                  <div ref={overlayRef} className={imageUrl.length ? 'overlayImg displayOverlay' : 'overlayImg'}>
                      <span style={{ zIndex:200, display:"inline-block", cursor:"pointer" }} className="pi pi-trash" title="Delete Thumbnail"></span>
                  </div>
                  </div>

                  <div data-thumbnail={2} data-url={mypost.thumbnail} onClick={selectThumbnail} ref={thumbRef} style={Object.keys(mypost).length ? {  background: `url(${mypost.thumbnail})`, objectFit:"cover", backgroundSize:"cover", border: "3px solid darkslateblue", padding:"10px 0" } : null} className={selectedThumbnail !== 2 ? "thumbnails" : "thumbnails checker"}></div>
                  <div data-thumbnail={3} data-url={mypost.thumbnail} onClick={selectThumbnail} ref={thumbRef2} style={Object.keys(mypost).length ? {  background: `url(${mypost.thumbnail})`, objectFit:"cover", backgroundSize:"cover" } : null} className={selectedThumbnail !== 3 ? "thumbnails" : "thumbnails checker"}></div>
                </div>
              </div>
            </div>
            {Object.keys(mypost).length ?
              (<div style={{ marginTop:"10px", position:"sticky", top:"20px" }}>
                <div>
                  <video poster={Object.keys(mypost).length && mypost.thumbnail} controls preload='none' src={Object.keys(mypost).length && mypost.video} controlsList='nodownload' width={300} height = {200} ref={videoRef}></video>
                </div>
              </div>) :
              <ContentLoader
                speed={8}
                width={300}
                height={240}
                viewBox="0 0 300 240"
                backgroundColor="#e5e0e0"
                foregroundColor="#ecebeb"
                {...props}
              >
                <rect x="0" y="0" rx="5" ry="5" width="100%" height="220" />
              </ContentLoader>
            }

          </div>}
          </div>


        </DialogContent>
        {props.active === 1 ?
        <DialogActions style={{ padding:"20px 20px" }}>
          <span style={{ fontSize:"12px", textAlign:"center", width:"70%", margin:"0 auto", lineHeight:"20px" }}>By submitting your videos to Uncensored, you acknowledge that you agree to Uncensored's <Link to="#">Terms of Service</Link> and <Link to="#">Community Guidelines.</Link>
                Please make sure that you do not violate others' copyright or privacy rights. <Link to="#">Learn more</Link></span>
        </DialogActions> :
        <DialogActions style={{margin:0, padding:"0 10px"}}>
          <div style={{ display:"flex", flexDirection:"row-reverse", justifyContent:"space-between", width:"100%", margin:"10px 0" }}>

            <LoadingButton onClick={publishVideo} loading={disabled} loadingPosition="start" startIcon={<PublishIcon />} variant="contained">Publish Video</LoadingButton>
            <div className='status-reporter'>
              <div className="lds-ripple"><div></div><div></div></div>
              <span style={{fontSize:"12px", fontFamily:"Roboto"}}>Generating video thumbnail...</span>
            </div>
          </div>
        </DialogActions>}
      </BootstrapDialog>
    </div>
  );
}


const mapDispatchToprops = {
  createPost
}


export default connect(null, mapDispatchToprops)(UploadVideo);
