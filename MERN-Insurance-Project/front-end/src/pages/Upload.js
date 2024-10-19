import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import './App.css'; 

export default function App() {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/');  // Only navigate inside a lifecycle hook
        }
      }, [navigate]);    
      
    const [documentType, setdocumentType] = useState('');
    const [fileUpload, setfileUpload] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const userId = localStorage.getItem("userId");
    // eslint-disable-next-line
    const [Cookies,_] = useCookies(["access_token"]);

    const handleDocType = (event) => {
        setSuccess('');
        setError('');
        setdocumentType(event.target.value);
    };

    const handleFile = (event) => {
        setSuccess('');
        const file = event.target.files[0];
        if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
            setError("Unsupported file type. Please upload a PDF, JPEG, or PNG file.");
            return;
        }
        if (file.size > 10*1024*1024 ){
            setError("File exceeds the maximum size limit(10MB). Please upload a smaller file.");
            return;
        }
        setError('')
        setfileUpload(file);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (error !== ''){
            console.log("There's an error");
        }
        else{
            const formData = new FormData();
            formData.append('fileUpload', fileUpload); // Append the file to FormData
            formData.append('documentType', documentType); // Append documentType
            formData.append('userId', userId); // Append documentType

            setdocumentType('');
            setSubmitting(true);

            try {
            const response = await axios.post('https://fun-projects.onrender.com/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  authorization: Cookies.access_token,
                },
              });
              alert(response.data.message);
            } catch (error) {
              console.error('Error uploading KYC document:', error);
            }
            setSuccess("Documents submitted successfully. Verification may take up to 24 hours.");
            setSubmitting(false);
        }
    };


    return (
        <div className='main'>
            
        <header className='navbar'>
            <div className="logo">Company Logo</div>
            <nav className="nav-links">
              <a href="/">Dashboard</a>
              <a href="/Login" onClick={() => {localStorage.removeItem("token");}} >Logout</a>
            </nav>
        </header>
            
        <form onSubmit={onSubmit}>
            <h1>KYC Document Upload</h1>
                <div className="form-group">
                    <h3>Please upload your ID and Address proof for identity verification.</h3>
                    <label htmlFor="documentType" >Document Type: </label>
                    <br />
                    <select id = "documentType" value={documentType} required 
                        disabled={submitting} onChange={handleDocType}>
                        <option value = "">Select Document Type</option>
                        <option value = "Id Proof">ID Proof</option>
                        <option value = "Address Proof">Address Proof</option>
                    </select>
                    <br /><br />
                    </div>

                    <div className="form-group"> 
                        <label htmlFor="fileUpload">Upload File: </label>
                        <br />
                        <input  type="file" name="fileUpload" required disabled={submitting}
                            accept=".pdf, .jpeg, .png" onChange={handleFile}/>
                        <br /><br />
                    </div>
            
                    <div className="form-group">
                        <input type="submit" value="Submit For Verification" className="btn btn-primary" disabled={submitting} />
                    </div>
                            
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            </div>
    );
}
