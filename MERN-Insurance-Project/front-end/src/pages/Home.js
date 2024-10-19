import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'; 

export default function App() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          navigate('/dashboard');  // Only navigate inside a lifecycle hook
        }
      }, [navigate]);

   const [formData, setFormData] = useState({
            name: '',
            email: '',
            phone: '',
            password:'',
            confirmpassword:''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmpassword) {
            setError('Passwords do not match!');
            // Hide Error message after 3 seconds
              setTimeout(() => {
                setError('');
              }, 3000);
        }
        else{
            try {
                await axios.post('https://fun-projects.onrender.com/register', formData);
                alert('Registration successful');
        
                setTimeout(() => {
                  navigate('/login'); // Programmatically navigate to login page
                }, 2000); // 2-second delay to show the success message
        
              } catch (error) {
                alert('Registration failed');
              }            


            console.log('Form Data Submitted:', formData);
            setSuccess('Registration successful. Check your email for confirmation.');
              // Hide success message after 3 seconds
              setTimeout(() => {
                setSuccess('');
              }, 3000);
        }
    };

    const onChange = (event) => {
       const { name, value } = event.target;
        setFormData({ 
            ...formData, 
            [name]: value });
    };

    return (
        <div className='main'>
            
        <header className='navbar'>
            <div className="logo">Logo</div>
            <nav className='nav-links'>
              <a href="/">Home</a>
              <a href="/login">Login</a>
            </nav>
      </header>
            
        <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <input  
                            type="text"
                            name="name"
                            required
                            className="form-control"
                            value={formData.name}
                            onChange={onChange}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>Email: </label>
                        <input  
                            type="email"
                            name="email"
                            required
                            className="form-control"
                            value={formData.email}
                            onChange={onChange}
                            />
                    </div>

                    <div className="form-group">
                        <label>Phone: </label>
                        <input 
                            type="number" 
                            name="phone"
                            required
                            className="form-control"
                            value={formData.phone}
                            onChange={onChange}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>Password: </label>
                        <input  
                            type="password"
                            name="password"
                            required
                            className="form-control"
                            value={formData.password}
                            onChange={onChange}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>Confirm Password: </label>
                        <input  
                            type="password"
                            name="confirmpassword"
                            required
                            className="form-control"
                            value={formData.confirmpassword}
                            onChange={onChange}
                            />
                    </div>
            
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
            
                    {/* "Already have an account" message and login link */}
                    <div className="login-message">
                    <h3> Already have an account? Login instead </h3>
                    <button onClick={() => navigate('/Login')}>Login</button>
                    </div>

            </form>
            </div>
    );
 
}