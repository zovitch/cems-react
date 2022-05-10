import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addFile } from '../../actions/upload';

import './FileUpload.css';

const FileUpload = ({ addFile, upload }) => {
  const [file, setFile] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  const [filename, setFilename] = useState('Choose Picture'); // This is for the label

  const onChange = async (e) => {
    if (fileTypes.indexOf(e.target.files[0].type) !== -1) {
      var archivo = await returnFile(e.target.files[0]);
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
      setFilePreview(archivo);
    }
  };

  function returnFile(file) {
    var reader = new FileReader();
    return new Promise((resolve) => {
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    });
  }

  function DeleteImage() {
    setFilename('Choose Picture');
    setFilePreview('');
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); //this file comes from the backend const file = req.files.file
    addFile(formData);
  };

  return (
    <section>
      <p className='lead'>FileUpload Test Section</p>

      <form onSubmit={onSubmit}>
        <div className='upload-wrapper'>
          <div className='upload-box'>
            <input
              type='file'
              accept='image/*'
              id='customFile'
              className='inputfile'
              onChange={onChange}
            />
            <label htmlFor='customFile'>
              <figure>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='17'
                  viewBox='0 0 20 17'
                >
                  <path d='M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z' />
                </svg>
              </figure>
              {filename}
            </label>
          </div>
          <div className='preview-box'>
            {filePreview && (
              <div className='img-wrp'>
                <img type='image' src={filePreview} alt='uploaded' />
                <p onClick={() => DeleteImage()}>
                  <i class='fas fa-square-xmark fa-2x'></i>
                </p>
              </div>
            )}
          </div>
        </div>
        <input type='submit' value='Upload' className='btn btn-dark' />
      </form>
      {upload.uploadedFile &&
        upload.uploadedFile.fileName &&
        upload.uploadedFile.filePath && (
          <img
            style={{ width: '200px' }}
            src={upload.uploadedFile.filePath}
            alt=''
          />
        )}
    </section>
  );
};

FileUpload.propTypes = {
  addFile: PropTypes.func.isRequired,
  upload: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  upload: state.upload,
});

export default connect(mapStateToProps, { addFile })(FileUpload);
