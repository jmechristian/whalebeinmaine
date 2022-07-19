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
          <Flex direction={'column'}>
            <Box w={'100%'} height='100%'>
              <Image src={mark.urls[imageIndex]} width='100%' />
            </Box>
            <Flex justifyContent={'space-between'} alignItems='center'>
              <Box
                backgroundColor={'black'}
                borderRadius='50%'
                padding={'6px'}
                onClick={moveLeft}
              >
                <ChevronLeftIcon w='8' h='8' color={'white'} />
              </Box>
              <Box my='6'>
                <Text fontSize={'2xl'} fontWeight={'bold'}>
                  {mark.title}
                </Text>
              </Box>
              <Box
                backgroundColor={'black'}
                borderRadius='50%'
                padding={'6px'}
                onClick={moveRight}
              >
                <ChevronRightIcon w='8' h='8' color={'white'} />
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
