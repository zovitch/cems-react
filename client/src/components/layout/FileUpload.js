import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addFile } from '../../actions/upload';
import api from '../../utils/api';
import Progress from './Progress';

const FileUpload = ({ addFile, upload }) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState(''); // This is for the label
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [previewImage, setPreviewImage] = useState('');

  const onChange = (e) => {
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); //this file comes from the backend const file = req.files.file

    // addFile(formData);
    // setUploadedFile({ fileName, filePath });
    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          //Clear percentage
          setTimeout(() => {
            setUploadPercentage(0);
          }, 10000);
        },
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log('There was a problem with the Server');
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <section className='container'>
      <h4 className='display-4 text-center mb-4'>
        <i className='fas fa-cloud'></i> FileUpload Test Section
      </h4>

      <form onSubmit={onSubmit}>
        <div className='mb-3'>
          <input
            className='form-control'
            type='file'
            id='formFile'
            onChange={onChange}
          />
        </div>
        <div className='row  col-md-6 m-auto'>
          <small className='text-center'>{filename} </small>
          <img src={previewImage} alt='' />
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type='submit'
          value='Upload'
          className='btn btn-dark mt-3 mb-3'
        />
      </form>

      {/* {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null} */}

      {/* {upload.uploadedFile &&
        upload.uploadedFile.fileName &&
        upload.uploadedFile.filePath && (
          <img
            style={{ width: '200px' }}
            src={upload.uploadedFile.filePath}
            alt=''
          />
        )} */}
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
