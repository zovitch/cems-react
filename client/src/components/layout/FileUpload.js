import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addFile } from '../../actions/upload';

const FileUpload = ({ addFile, upload }) => {
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
    addFile(formData);
  };

  return (
    <section>
      <p className='lead'>FileUpload Test Section</p>

      <form onSubmit={onSubmit}>
        <div>
          <input type='file' id='customFile' onChange={onChange} />
          <label htmlFor='customFile'>{filename}</label>
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
