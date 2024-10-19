import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
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
            password:'',
    });
    const [_, setCookies] = useCookies(["access_token"]);

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await axios.post('https://fun-projects.onrender.com/login', formData);
            setCookies("access_token", result.data.token);
            localStorage.setItem("token",result.data.token);
            localStorage.setItem("userId",result.data.userId);
            alert('Login successful');
    
            setTimeout(() => {
              navigate('/dashboard'); // Programmatically navigate to login page
            }, 2000); // 2-second delay to show the success message
    
          } catch (error) {
            alert('Login failed. ' + error.response.data.message);
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
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </div>
                    {/* "Already have an account" message and login link */}
                    <div className="login-message">
                        <h3> Don't have an account? Register instead </h3>
                        <button onClick={() => navigate('/')}>Register</button>
                    </div>
            </form>

            </div>
    );
}