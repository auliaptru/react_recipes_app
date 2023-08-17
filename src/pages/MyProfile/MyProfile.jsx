import { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import {
    updatePassword,
    updateProfile,
    EmailAuthProvider,
    deleteUser,
    reauthenticateWithCredential,
} from 'firebase/auth';
import { MdClose, MdEdit, MdEmail, MdOutlineCameraAlt } from 'react-icons/md';
import useStorage from '../../hooks/useStorage';
import useFirestore from '../../hooks/useFirestore';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

import './myProfile.scss';

const updateState = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
};

const editState = {
    editName: false,
    editPass: false,
    editEmail: false,
};

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [isChangePhoto, setIsChangePhoto] = useState(false);
    const [file, setFile] = useState(null);
    const [deleteAcc, setDeleteAcc] = useState(false);
    const [newProfile, setNewProfile] = useState(updateState);
    const [isEditProfile, setIsEditProfile] = useState(editState);

    const prevFileRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { uploadFile, profileImg, progress } = useStorage();
    const { formData } = useFirestore('recipes');

    const { name, currentPassword, newPassword } = newProfile;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleStateChange = (e) => {
        setNewProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Upload a new file if it's different from the previous file.
    useEffect(() => {
        if (file && file !== prevFileRef.current) {
            uploadFile(file, 'profile');
            prevFileRef.current = file;
        }
    }, [file]);

    // for change password
    const reauthenticate = async (currentPassword) => {
        if (currentPassword) {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        await reauthenticate(currentPassword);

        if (user) {
            try {
                await updateProfile(user, {
                    displayName: name || user.displayName,
                    photoURL: profileImg,
                });

                await updatePassword(user, newPassword);

                const loggedInUserRecipe = formData.filter(
                    (data) => data.userId === user.uid
                );

                const batch = writeBatch(db);

                if (formData.length > 0 && loggedInUserRecipe) {
                    loggedInUserRecipe.forEach((recipe) => {
                        const recipeDocRef = doc(db, 'recipes', recipe.id);
                        const updateRecipe = {
                            ...recipe,
                            author: user.displayName,
                            profileImg: user.photoURL,
                        };
                        batch.update(recipeDocRef, updateRecipe);
                    });
                    await batch.commit();
                }
                toast.success('Update successfully!');
                setIsEdit(false);

                setIsEditProfile(editState);
            } catch (error) {
                console.error('An error occurred while updating:', error);
            }
        } else {
            console.log('error');
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (currentPassword) {
            await reauthenticate(currentPassword);
            try {
                await deleteUser(user);

                const recipeQuerySnapshot = await getDocs(
                    query(
                        collection(db, 'recipes'),
                        where('userId', '==', user.uid)
                    )
                );

                recipeQuerySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                toast.success('Delete account successfully');
                navigate('/');
            } catch (error) {
                console.error('An error occurred while updating', error);
            }
        } else {
            toast.error('Please add your password');
        }
    };

    return (
        <>
            {user && (
                <div className='myprofile'>
                    {/* edit profile */}
                    {isEdit ? (
                        <div className='myprofile__wrapper'>
                            <h1 className='title__edit'>Edit Profile</h1>
                            <form
                                className='edit__account'
                                onSubmit={handleUpdate}
                            >
                                {/* EDIT NAME */}
                                {!isEditProfile.editName ? (
                                    <div className='input__wrapper'>
                                        <div className='icon__wrapper'>
                                            <FaUser className='icon' />
                                        </div>
                                        <div>
                                            <label>Name</label>
                                            <h3>{user.displayName}</h3>
                                        </div>
                                        <MdEdit
                                            className='editIcon'
                                            onClick={() =>
                                                setIsEditProfile({
                                                    ...isEditProfile,
                                                    editName: true,
                                                })
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className='input__wrapper'>
                                        <label htmlFor='name'>Name</label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={name}
                                            placeholder={user.displayName}
                                            onChange={handleStateChange}
                                        />
                                        <MdClose
                                            className='editIcon'
                                            onClick={() =>
                                                setIsEditProfile({
                                                    ...isEditProfile,
                                                    editName: false,
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                {/* EMAIl */}
                                <div className='input__wrapper'>
                                    <div className='icon__wrapper'>
                                        <MdEmail className='icon' />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <h3>{user.email}</h3>
                                    </div>
                                </div>

                                {/* CHANGE PASSWORD */}
                                {isEditProfile.editPass ? (
                                    <div className='pass__wrapper'>
                                        <label>New Password</label>
                                        <input
                                            name='newPassword'
                                            type='password'
                                            placeholder='Change your password'
                                            value={newPassword}
                                            onChange={handleStateChange}
                                        />
                                        <label>Confirm Password</label>
                                        <input
                                            name='currentPassword'
                                            type='password'
                                            placeholder='Type your password'
                                            value={currentPassword}
                                            onChange={handleStateChange}
                                        />
                                        <MdClose
                                            className='closeIcon'
                                            onClick={() =>
                                                setIsEditProfile({
                                                    ...isEditProfile,
                                                    editPass: false,
                                                })
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className='input__wrapper'>
                                        <div className='icon__wrapper'>
                                            <MdEdit className='icon' />
                                        </div>
                                        <h3>Change Password</h3>
                                        <MdEdit
                                            className='editIcon'
                                            onClick={() =>
                                                setIsEditProfile({
                                                    ...isEditProfile,
                                                    editPass: true,
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                {/* BUTTONS */}
                                <div className='button__wrapper'>
                                    <button
                                        className={`${
                                            progress !== null && progress < 100
                                                ? 'disabled'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: 'green' }}
                                        type='submit'
                                    >
                                        Update
                                    </button>
                                    <button
                                        style={{ backgroundColor: 'brown' }}
                                        onClick={() => setIsEdit(false)}
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // MY ROFILE PAGE DISPLAY
                        <div className='myprofile__wrapper'>
                            <h1>{user.displayName}</h1>
                            <h4>{user.email}</h4>
                            <div className='myprofile__img'>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt='' />
                                ) : (
                                    <MdOutlineCameraAlt className='icon' />
                                )}
                            </div>

                            {/* UPDATE PHOTO PROFILE */}
                            {isChangePhoto && (
                                <form
                                    className='myprofile__edit'
                                    onSubmit={handleUpdate}
                                >
                                    <input
                                        type='file'
                                        name='photo'
                                        id='photo'
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type='submit'
                                        className={`${
                                            progress !== null && progress < 100
                                                ? 'disabled'
                                                : ''
                                        }`}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setIsChangePhoto(false)}
                                        style={{ backgroundColor: 'brown' }}
                                    >
                                        Close
                                    </button>
                                </form>
                            )}

                            {/* DELETE ACCOUNT */}
                            {deleteAcc && (
                                <form
                                    onSubmit={handleDeleteUser}
                                    className='myprofile__edit'
                                >
                                    <label htmlFor='pass'>
                                        Confirm Password
                                    </label>
                                    <input
                                        name='currentPassword'
                                        type='password'
                                        id='pass'
                                        placeholder='Type your password'
                                        value={currentPassword}
                                        onChange={handleStateChange}
                                    />
                                    <button type='submit'>Delete</button>
                                    <button
                                        style={{ backgroundColor: 'brown' }}
                                        onClick={() => setDeleteAcc(false)}
                                    >
                                        Back
                                    </button>
                                </form>
                            )}

                            {/* BUTTONS */}
                            <div className='button__wrapper'>
                                {!isChangePhoto && (
                                    <button
                                        onClick={() => setIsChangePhoto(true)}
                                    >
                                        Change Photo
                                    </button>
                                )}
                                <button onClick={() => setIsEdit(true)}>
                                    Edit Account
                                </button>
                                {!deleteAcc && (
                                    <button onClick={() => setDeleteAcc(true)}>
                                        Delete Account
                                    </button>
                                )}
                            </div>

                            {/* DATE & TIME OF SIGN UP FOR THE FIRST TIME*/}
                            <p>
                                Member since : <br />
                                <span> {user.metadata.creationTime}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default MyProfile;
