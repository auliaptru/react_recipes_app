import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './signup.scss';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await updateUsername(user, username);
            toast.success('Sign-up successfully!');
            navigate('/signin');
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                toast.error('Password should be at least 6 characters');
            } else if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already in use.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email.');
            }
            console.log(error.message);
        }
    };

    const updateUsername = async (user, name) => {
        try {
            await updateProfile(user, {
                displayName: name,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='signup'>
            <div className='signup__wrapper'>
                <form onSubmit={handleSignup}>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Enter your username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit'>Create Account</button>
                </form>

                <div className='signup__title'>
                    <h1>Start Sharing Your Recipes</h1>
                    <h3>Sign-up and Get Started!</h3>
                    <p>
                        Let&apos;s get started on a delicious adventure
                        together! Sign up now for free and begin sharing your
                        recipes, learning from others, and exploring the diverse
                        world of cooking.
                    </p>
                    <p>
                        Already have an account?{' '}
                        <span>
                            <a href='/signin'>Sign in now!</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
