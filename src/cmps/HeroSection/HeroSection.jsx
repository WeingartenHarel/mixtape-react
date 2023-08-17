import React from 'react';
import { useNavigate } from "react-router-dom";


const HeroSection = ({emitScrollMeTo}) => {
    const navigate = useNavigate();
    const startListening = React.useRef(null);

    const createNewPlaylist = () => {
        // this.$store.commit({type:'setMixEmpty'}) null
        // this.$router.push(`mix/details`)
        navigate("/mix?mixId=newmix")
    };

    return (
        <section className="hero">
            <img src="https://res.cloudinary.com/hw-projects/image/upload/v1606309308/appmixes/party002.jpg" />
            <div className="hero-text-area" ref={startListening}>
                <h2>Enjoy, Create and Share an awesome mixTape</h2>
                <div className="buttons">
                    <a className="button start-listening" onClick={() => emitScrollMeTo('mix-list-home-container')}>
                        Start listening
                    </a>
                    <a className="button create-playlist" onClick={createNewPlaylist}>
                        Create Playlist
                    </a>
                </div>
            </div>
            {/* <mix-video-player /> */}
            {/* <MixCarousel /> */}
        </section>
    );
};

export default HeroSection;

