import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import '../components/progressbar.css'; // Keep your original CSS
//import './Dashboard.css'; // Keep your original CSS

function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [notifications, setNotifications] = useState([]); // Hold notifications
    const [documents, setDocuments] = useState([]); // Hold notifications
    const user = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    }

    // Step details
    const steps = [
        { label: 'KYC Verification', status: 'KYC Approval Pending' },
        { label: 'Docs Submission', status: 'KYC Approved. Document Review Pending' },
        { label: 'Documents Review', status: 'Document Reviewed. Policy Approval Pending' },
        { label: 'Policy Issued', status: 'Policy Approved' },
    ];

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const response = await axios.get(`https://fun-projects.onrender.com/employees/${userId}`);
                let completedStepsFromApi = 1;
                ['kycStatus', 'docStatus', 'policyStatus'].forEach(status => {
                    if (response.data[status] === 'Approved') completedStepsFromApi += 1;
                });
                setCurrentStep(completedStepsFromApi - 1); // Set current step (0-based)
            } catch (error) {
                console.error('Error fetching step data:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`https://fun-projects.onrender.com/employees/${userId}`);
                console.log(response.data.notifications);
                setNotifications(response.data.notifications); // Set notifications from API
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employees/${userId}`);
                console.log(response.data.documents);
                setDocuments(response.data.documents); // Set notifications from API
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchSteps();
        fetchNotifications();
        fetchDocuments();
    }, [userId]);

    // Handle step click
    const nextStep = (index) => {
        setCurrentStep(index);
    };

    return (
        <div className="main">
            <header className='navbar'>
                <div className="logo">Logo</div>
                <nav>
                <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/upload">KYC Upload</a></li>
                    <li><a href="/upload-Additional">Upload Documents</a></li>
                    <li><a href="/verify">KYC Update</a></li>
                    <li><a href="/Login" onClick={() => { localStorage.removeItem("token"); }}>Logout</a></li>
                </ul>
                </nav>
            </header>
            <br />
            <div>
                <h3>Status Update: {steps[currentStep].status}</h3>
            </div>
            <ul>
                {steps.map((step, index) => (
                    <li key={index}>
                        <div
                            className={`step ${index <= currentStep ? 'active' : ''}`}
                            onClick={() => nextStep(index)}
                        >
                            <p>{index + 1}</p>
                            <i className="awesome fa-solid fa-check"></i>
                        </div>
                        <p className="label">{step.label}</p>
                    </li>
                ))}
            </ul>
            <div className="notifications">
                <h3>Notifications</h3>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li key={index}>
                                <p>{notification.message}</p>
                                <em>{new Date(notification.createdAt).toLocaleString()}</em>
                            </li>
                        ))
                    ) : (
                        <p>No notifications available</p>
                    )}
                </ul>
                </ul>
            </div>
        </div>
    );
}

export default App;
