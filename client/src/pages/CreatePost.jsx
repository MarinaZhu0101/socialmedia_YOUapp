import React, { useState, useEffect} from 'react';
import "../App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function CreatePost() {

  const [file, setFile] = useState();
  const [preview, setPreview] = useState("");
  let navigate = useNavigate();

  const checkAuthentication = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert('You must be logged in to choose a file.');
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleFile =(e) => {
    if (!checkAuthentication()) {
      e.target.value = ''; 
      return;
    }


    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.match('image.*')) { 
        setFile(selectedFile);
      } else {
        alert("Please upload an image file.");
        e.target.value = ''; 
      }
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a image first!');
      return;
    }
    const formdata = new FormData();
    formdata.append('image', file);

    const accessToken = sessionStorage.getItem("accessToken"); 
    if (!accessToken) {
      alert('You must be logged in to create a post.');
      navigate("/login");
      return;
    }

    axios.post('https://you-app-tau.vercel.app/posts', formdata, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
      }
    })
    .then(res =>{
      console.log(res)
      navigate('/'); 
    })
    .catch(err => {
      console.log(err);
      if (err.response && err.response.status === 401) {
        alert('Unauthorized. Please login again.');
        navigate("/login");
      }
    });
  }


  useEffect(() => {
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreview(reader.result);
          };
          reader.readAsDataURL(file);
      } else {
          setPreview("");
      }
  }, [file]);

  return (
    <div className='createpost-page'>
      <form className='create' encType="multipart/form-data" onSubmit={handleUpload}>
      {!preview && (
        <div className='upload-text'>
        <h1>Upload your file</h1>
        <p >File should be an image</p>
        </div>
      )}
        {preview && <img src={preview} alt="Preview" className="image-preview" />}
        <label htmlFor="file-upload" className="custom-file-upload">Choose File</label>
        <input id="file-upload" type="file" onChange={handleFile} className='image-input' accept="image/jpeg, image/png, image/gif"/>
        <button type='submit' className='upload' >Upload Image</button>
      </form>
    </div>
  )
}

export default CreatePost
