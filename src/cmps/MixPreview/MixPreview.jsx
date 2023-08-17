import React from 'react';
import { useSelector } from 'react-redux';

const MixPreview = ({ mix }) => {
  const mixNameClass = mix.genre === 'israeli' ? 'mix-name isreali' : 'mix-name';
  const songsAmount = mix.songs.length;

  return (
    <section className="details">
      {mix && (
        <div className="mix">
          <div className="images">
            <img className="mix-image shadow" src={mix.imgUrl} alt="Mix Image" />
            <img
              className="img-frame"
              src="https://res.cloudinary.com/hw-projects/image/upload/v1606518099/appmixes/logo_frame.png"
              alt="Image Frame"
            />
          </div>
          <div className="info">
            <span className={mixNameClass}>{mix.name}</span>
            <span className="mix-desc">{mix.desc}</span>
            <div className="stats">
              <div className="likes flex">
                <span className="mix-likes">{mix.likes} <i className="fas fa-heart"></i></span>
                <span className="mix-views">{mix.views} <i className="fas fa-eye"></i></span>
              </div>
              <span className="mix-amount">{songsAmount} <i className="fas fa-music"></i></span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MixPreview;