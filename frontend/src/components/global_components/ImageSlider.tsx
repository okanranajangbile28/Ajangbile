import { useState, useEffect } from 'react';

import styled, { CSSProperties } from 'styled-components';

const ImageSlider = ({
  slides,
  timer,
}: {
  slides: string[];
  timer: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties;
  useEffect(() => {
    const slider = setInterval(() => {
      const isLastSlide = currentIndex === slides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, timer);
    return () => clearInterval(slider);
  }, [currentIndex, slides.length, timer]);

  return (
    <SlideStyleWrapper>
      <div className='containerStyle' style={containerStyle}>
        {slides.map((image, index) => {
          return (
            <img
              key={index}
              src={image}
              alt='backgroundImage'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: `${currentIndex === index ? 1 : 0}`,
                transition: 'opacity 0.5s 2s ease-in-out',
              }}
            />
          );
        })}
      </div>
    </SlideStyleWrapper>
  );
};

const SlideStyleWrapper = styled.section`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transition: transform 0.5s 1s ease-in-out;
  .productLink {
    button {
      color: red !important;
    }
  }
`;

export default ImageSlider;
