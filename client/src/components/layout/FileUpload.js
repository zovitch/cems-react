import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { postUpload } from '../../actions/upload';

const FileUpload = ({ postUpload, upload }) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File'); // This is for the label

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); //this file comes from the backend const file = req.files.file
    postUpload(formData);
  };

  return (
    <section className='container'>
      <p className='lead'>FileUpload Test Section</p>

      <form onSubmit={onSubmit}>
        <div>
          <input type='file' id='customFile' onChange={onChange} />
          <label htmlFor='customFile'>{filename}</label>
        </div>

        <input type='submit' value='Upload' className='btn btn-dark' />
      </form>
      {upload.uploadfile &&
        upload.uploadfile.fileName &&
        upload.uploadfile.filePath && (
          <img
            style={{ width: '100%' }}
            src={upload.uploadfile.filePath}
            alt=''
          />
        )}
    </section>
  );
};

FileUpload.propTypes = {
  postUpload: PropTypes.func.isRequired,
  upload: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  upload: state.upload,
});

export default connect(mapStateToProps, { postUpload })(FileUpload);
