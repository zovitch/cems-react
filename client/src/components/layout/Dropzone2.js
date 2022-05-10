import React, { useState, useRef } from 'react';
import api from '../../utils/api';

import './Dropzone.css';

function Dropzone2({ name, id, normalText, dropText }) {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState('');
  const [dragtext, setDragtext] = useState(normalText);
  const DragDrop = useRef();

  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    var src = '';

    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileTypes.indexOf(fileList[i].type) != -1) {
          src = await returnFile(fileList[i]);
          setFiles((old) => [...old, src]);
          setFile(fileList[0]);
        }
      }
    }

    if (DragDrop.current) {
      DragDrop.current.style.borderColor = 'lightgray';
      DragDrop.current.style.backgroundColor = 'transparent';
    }
    setDragtext(normalText);
  }

  // function to return the list of images for preview
  function returnFile(file) {
    var reader = new FileReader();
    return new Promise((resolve) => {
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    });
  }

  function handleEnter(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    if (DragDrop.current) {
      DragDrop.current.style.borderColor = 'lightgray';
      DragDrop.current.style.backgroundColor = 'transparent';
    }
    setDragtext(normalText);
  }

  function handleOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (DragDrop.current) {
      DragDrop.current.style.borderColor = '#1890ff';
      DragDrop.current.style.backgroundColor = 'rgba(119, 119, 255,0.1)';
    }
    setDragtext(dropText);
  }

  async function handleChange(e) {
    if (fileTypes.indexOf(e.target.files[0].type) !== -1) {
      var archivo = await returnFile(e.target.files[0]);
      setFiles((old) => [...old, archivo]);
      setFile(e.target.files[0]);
    }
  }

  function DeleteImage(index) {
    setFiles((old) => {
      old.splice(index, 1);
      return [...old];
    });
  }

  async function onUpload(e) {
    e.preventDefault();
    console.log(file);
    const formData = new FormData();
    formData.append('file', files[0]); //this file comes from the backend const file = req.files.file

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // const { fileName, filePath } = res.data;
      // setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log('There was a problem with the Server');
      } else {
        console.log(err.response.data.msg);
      }
    }
  }
  return (
    <>
      <div
        ref={DragDrop}
        className='upload-wrapper'
        onDragEnter={handleEnter}
        onDragLeave={handleLeave}
        onDragOver={handleOver}
        onDrop={handleDrop}
      >
        <input type='file' id={id} name={name} onChange={handleChange} />
        <label>
          <h1>
            <i className='fas fa-cloud-arrow-up'></i>
          </h1>
          <p>{dragtext}</p>
        </label>
      </div>
      <div className='uploaded-wrapper'>
        {files.map((item, index) => {
          return (
            <div className='img-wrp' key={index}>
              <img tabIndex={index} type='image' src={item} alt='uploaded' />
              <p onClick={() => DeleteImage(index)}></p>
              <h1>
                <i className='fas fa-square-xmark'></i>
              </h1>
            </div>
          );
        })}
      </div>
      <input
        onClick={onUpload}
        type='submit'
        value='Upload'
        className='btn btn-dark mt-3 mb-3'
      />
    </>
  );
}

export default Dropzone2;

// https://medium.com/@castlevania_jorge/how-to-make-dropzone-with-only-javascript-react-and-css-cb36f05e3c0c
// https://codesandbox.io/s/admiring-engelbart-3i0hu?fontsize=14&hidenavigation=1&theme=dark&file=/src/App.js:178-249
