import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';

const ImageModal = ({ mark, imageOpen, imageClose }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const moveLeft = () => {
    if (imageIndex === 0) {
      setImageIndex(mark.urls.length - 1);
    } else {
      setImageIndex(imageIndex - 1);
    }
  };

  const moveRight = () => {
    if (imageIndex === mark.urls.length - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex + 1);
    }
  };

  return (
    <Modal
      isCentered
      size={'3xl'}
      isOpen={imageOpen}
      onClose={imageClose}
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent bgColor={'white'}>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={'column'} justifyContent='center'>
            <Box w='100%' textAlign={'center'}>
              <Image
                src={mark.urls[imageIndex]}
                objectFit='contain'
                objectPosition={'center'}
                w='100%'
                maxHeight='80vh'
              />
            </Box>
            <Flex justifyContent={'space-between'} alignItems='center'>
              <Box
                backgroundColor={'white'}
                borderColor={'blue.800'}
                border='1px'
                borderRadius='50%'
                padding={'6px'}
                boxShadow='xl'
                onClick={moveLeft}
              >
                <ChevronLeftIcon w='8' h='8' color={'blue.800'} />
              </Box>
              <Box my='6'>
                <Text fontSize={'2xl'} color='gray.700' fontWeight={'bold'}>
                  {mark.title}
                </Text>
              </Box>
              <Box
                backgroundColor={'white'}
                borderColor={'blue.800'}
                border='1px'
                borderRadius='50%'
                padding={'6px'}
                onClick={moveRight}
                boxShadow='xl'
              >
                <ChevronRightIcon w='8' h='8' color={'blue.800'} />
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
