import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase/config';
import { toast } from 'react-toastify';

const initialState = {
    title: '',
    desc: '',
    ingredients: '',
    tutorials: '',
    category: '',
    duration: '',
    clickCount: 0,
};

const useStorage = () => {
    const [progress, setProgress] = useState(null);

    const [state, setState] = useState(initialState);
    const [profileImg, setProfileImg] = useState(null);

    const uploadFile = (file, fileType) => {
        let storageRef;
        if (!file) {
            toast.error('Please choose a file to upload');
        }

        const fileId = uuidv4();
        const typeFile = file.type.split('/')[1];

        if (fileType === 'recipe') {
            storageRef = ref(storage, `images/${fileId}.${typeFile}`);
        } else if (fileType === 'profile') {
            storageRef = ref(storage, `profileImages/${fileId}.${typeFile}`);
        }

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                toast.error('Upload failed');
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        console.log(error.code);
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        console.log(error.code);
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        console.log(error.code);
                        break;
                    default:
                        break;
                }
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                if (fileType === 'recipe') {
                    setState((prev) => ({ ...prev, imgUrl: downloadURL }));
                } else if (fileType === 'profile') {
                    setProfileImg(downloadURL);
                }
                setProgress(null);
                toast.success('File uploaded successfully!');
            }
        );
    };

    return {
        state,
        setState,
        uploadFile,
        progress,
        initialState,
        profileImg,
    };
};

export default useStorage;
