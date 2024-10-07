import React from 'react';
import ReactPlayer from 'react-player';

interface IntroVideoProps {
  onEnd: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onEnd }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <ReactPlayer
        url="/Intro_video_for_app.mp4"
        playing
        muted
        width="100%"
        height="100%"
        onEnded={onEnd}
      />
    </div>
  );
};

export default IntroVideo;