import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { database } from '../firebase';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const MarkerDrawer = ({ drawerOpen, drawerClose, session }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState('');
  const [files, setFiles] = useState(null);
  const [urls, setUrls] = useState([]);

  const uploadLocation = async () => {
    if (files && session) {
      for (const file of files) {
        const storageRef = ref(storage, `/${session}/${file.name}`);
        await uploadBytesResumable(storageRef, files);
        getDownloadURL(ref(storage, `/${session}/${file.name}`)).then((url) =>
          setUrls((prevArray) => [...prevArray, url])
        );
      }

      console.log(urls);
    } else {
      alert('Missing Session!');
    }
  };

  return (
    <>
      <Drawer isOpen={drawerOpen} placement='right' onClose={drawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder='Add Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              title='Add Images'
              type='file'
              onChange={(event) => setFiles(event.target.files)}
              multiple
            />
            <Button colorScheme='blue' onClick={uploadLocation}>
              Upload
            </Button>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant='outline'
              mr={3}
              onClick={() => {
                drawerClose();
                setFiles(null);
                setTitle('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => console.log(urls)}>Log</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MarkerDrawer;
