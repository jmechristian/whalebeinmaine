import React from 'react';

const MarkerPin = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 40 40'
      style={{ width: '40px', height: '40px' }}
    >
      <g>
        <path
          style={{
            fill: '#D31B5D',
            stroke: '#FFFFFF',
            strokeWidth: '1',
            strokeMiterlimit: '10',
          }}
          d='M32.2,17c0,7.7-9.4,21.3-12.2,21.3C16.7,38.4,7.8,24.8,7.8,17s5.5-14,12.2-14S32.2,9.3,32.2,17z'
        />
        <ellipse
          style={{
            fill: '#ffffff',
          }}
          cx='20'
          cy='15'
          rx='4'
          ry='4'
        />
      </g>
    </svg>
  );
};

export default MarkerPin;
