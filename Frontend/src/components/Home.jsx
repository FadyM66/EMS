import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import TopBar from './TopBar.jsx';
import Username from './Username.jsx';
import '../assets/style/login.css';
import '../assets/style/companies.css'
import '../assets/style/home.css'
import { getData } from '../assets/utils/utils.js';
import fetcher from '../assets/utils/fetcher.js';

const Home = () => {

    const [summary, setData] = useState({})

    useEffect(
        ()=>{
            const x = async () => {
                const { response, data } = await fetcher("http://localhost:8000/summary", "GET");
                console.log(data)
                setData(data)
            };
        
            x()        
        }
        ,[]
    )
    
    return (
        <>
            <Logo />
            <TopBar />
            <Username />
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Summary</h1>
                    <p>Quick numbers about the organization</p>
                </div>
                <div className='summary-data'>
                    <h1> companies: {summary.data?.companies}</h1>
                    <h1> departments: {summary.data?.departments}</h1>
                    <h1> employees: {summary.data?.employees}</h1>
                    <h1> users: {summary.data?.users}</h1>
                </div>
            </div>
        </>
    );
}

export default Home;