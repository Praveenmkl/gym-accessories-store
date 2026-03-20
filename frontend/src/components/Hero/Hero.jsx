import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import Hero_video from '../../assets/hero_vid.mp4';
import heroPoster from '../../assets/hero.png';
import hero_logo from '../../assets/hero_logo.png';

const Hero = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Some browsers ignore autoplay until a direct play call is attempted.
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Keep silent; user can still play manually if autoplay is blocked.
            });
        }
    }, []);

    const handleShopNowClick = () => {
        navigate('/products');
    };

    return (
        <div>
            <section className='hero'>
                {/*background video*/}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='auto'
                    poster={heroPoster}
                    className='hero-video'
                >
                    <source src={Hero_video} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>

                <div className='hero-content'>
                    <img src={hero_logo} alt='PowerFit' className='hero-logo' />
                    <p>Premium Gym Accessories for Serious Athletes</p>


                    <button className="hero-btn" onClick={handleShopNowClick}>
                        Shop Now
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Hero