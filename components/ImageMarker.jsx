import React from 'react';
import { Box } from '@chakra-ui/react';

const ImageMarker = () => {
  return (
    <Box
      width={'10'}
      height={'10'}
      fill='blue.700'
      bgColor={'white'}
      boxShadow='xl'
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
          clipRule='evenodd'
        />
      </svg>
    </Box>
  );
};

export default ImageMarker;
