import React, { useState } from 'react';

const DragDropPDF = props => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      if(props.setSelectedFile !== undefined){
        props.setSelectedFile(file);
      }
      setError('');
    } else {
      setSelectedFile(null);
      if(props.setSelectedFile !== undefined){
        props.setSelectedFile(null);
      }
      setError('Please upload a valid PDF file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      if(props.setSelectedFile !== undefined){
        props.setSelectedFile(file);
      }
      setError('');
    } else {
      setSelectedFile(null);
      if(props.setSelectedFile !== undefined){
        props.setSelectedFile(null);
      }
      setError('Please upload a valid PDF file.');
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          margin: '20px 0',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9'
        }}
      >
        {selectedFile ? (
          <p>File selected: {selectedFile.name}</p>
        ) : (
          <p>Drag and drop a PDF file here, or click to select a file</p>
        )}
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="fileInput"
      />

      <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#007bff' }}>
        Choose a file
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedFile && (
        <div>
          <h3>File Details:</h3>
          <p>File Name: {selectedFile.name}</p>
          {/* <p>File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p>File Type: {selectedFile.type}</p> */}
        </div>
      )}
    </div>
  );
};

export default DragDropPDF;
