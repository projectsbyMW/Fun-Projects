import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useCookies} from 'react-cookie';

import './App.css'; 

export default function App() {
    const [kycStatus, setKycStatus] = useState('Pending');
    const [rejectionReason, setrejectionReason] = useState('');
    const userId = localStorage.getItem("userId");
    const [Cookies,_] = useCookies(["access_token"]);
    const [documentType, setdocumentType] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token) {
          navigate('/');  // Only navigate inside a lifecycle hook
        }

        const fetchEmployees = async () => {
            try {
              const response = await axios.get(`https://fun-projects.onrender.com/employees/${userId}`);
              setKycStatus(response.data.kycStatus)
              const docs = response.data.documents;
              docs.forEach(doc=> {
                if (doc.documentType === "id proof" || doc.documentType === "address proof"){
                    if(doc.status === 'Rejected'){
                        setrejectionReason(doc.rejectionReason);
                        setdocumentType(doc.documentType)
                    }
                }
              });

            } catch (error) {
              console.error('Error fetching employees:', error);
            }
          };
        fetchEmployees();

      }, [navigate]);    

    const [fileUpload, setfileUpload] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFile = (event) => {
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

            try {
            const response = await axios.post('https://fun-projects.onrender.com/uploadreplacement', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  authorization: Cookies.access_token,
                },
              });
              alert(response.data.message);
              setKycStatus('Pending');
            } catch (error) {
              console.error('Error uploading KYC document:', error);
            }

            setSuccess("Documents submitted successfully. Verification may take up to 24 hours.");
        }
    };


    return (
        <div className='main'>
            
        <header className='navbar'>
            <div className="logo">Company Logo</div>
            <nav className='nav-links'>
              <a href="/">Dashboard</a>
              <a href="/Login">Logout</a>
            </nav>
        </header>
        <h1>KYC Verification</h1>
        <h3>Status: {kycStatus} </h3>
            {kycStatus === 'Rejected' && (
        <form onSubmit={onSubmit}>
             <h3 style={{ color: 'red' }}>{rejectionReason}</h3>
                    <div className="form-group"> 
                        <label htmlFor="fileUpload">Upload File: </label>
                        <br />
                        <input  type="file" name="fileUpload" required 
                            accept=".pdf, .jpeg, .png" onChange={handleFile}/>
                        <br /><br />
                    </div>
            
                    <div className="form-group">
                        <input type="submit" value="Upload New Documents" className="btn btn-primary" />
                    </div>
            
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            )}
            
            {kycStatus === 'Pending' && (<h3>Your KYC approval is pending. Please wait.</h3>)}
            {kycStatus === 'Approved' && (<h3 style={{ color: 'green' }}>Your KYC has been approved. You can proceed to the next step</h3>)}
            </div>
    );
 
}