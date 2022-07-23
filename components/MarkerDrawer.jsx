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
  Progress,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { database } from '../firebase';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as ref_database, set } from 'firebase/database';

const MarkerDrawer = ({
  drawerOpen,
  drawerClose,
  getMarks,
  lat,
  long,
  clearDraft,
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [urls, setUrls] = useState([]);
  const [percentage, setPercentage] = useState();

  const uploadFiles = async () => {
    if (files && title) {
      for (const file of files) {
        const storageRef = ref(storage, `/${title}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercentage(percent);
          },
          (err) => alert(err),
          () => {
            getDownloadURL(ref(storage, `/${title}/${file.name}`)).then((url) =>
              setUrls((prevArray) => [...prevArray, url])
            );
          }
        );
      }

      console.log(urls);
    } else {
      alert('Missing Title!');
    }
  };

  const uploadLocation = async () => {
    const date = Date.now();

    setLoading(true);
    await set(ref_database(database, `/markers/${date}`), {
      title,
      lat,
      long,
      urls,
    })
      .then(() => {
        console.log('Data Uploaded');
        setTitle('');
        setFiles(null);
        drawerClose();
        getMarks();
        clearDraft();
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <Drawer isOpen={drawerOpen} placement='right' onClose={drawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <VStack alignItems={'flex-start'} spacing='4'>
              <Input
                placeholder='Add Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                title='Add Images'
                type='file'
                onChange={(event) => setFiles(event.target.files)}
                variant='unstyled'
                multiple
              />
              <Button colorScheme='blue' onClick={uploadFiles}>
                Upload
              </Button>
            </VStack>
            <Progress value={percentage} mt='4' />
          </DrawerBody>

          <DrawerFooter>
            {loading ? (
              <Spinner color='blue.800' size={'xl'} />
            ) : (
              <>
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
                <Button onClick={uploadLocation} colorScheme={'blue'}>
                  Submit
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MarkerDrawer;
