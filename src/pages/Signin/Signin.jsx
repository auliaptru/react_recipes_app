import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './signin.scss';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Sign-in successfully!');
            navigate('/');
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email.');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Wrong password!');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('User not found');
            }
            console.log(error);
        }
    };

    return (
        <div className='signin'>
            <div className='signin__wrapper'>
                <div className='signin__title'>
                    <h1>Welcome! </h1>
                    <p>
                        Already have an account? Sign in to access your saved
                        recipes, interact with the community, and explore
                        delightful culinary inspirations.
                    </p>
                </div>
                <form onSubmit={handleSignin}>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit'>Sign In</button>
                    <p>
                        Don&apos;t have an account?{' '}
                        <span>
                            <a href='/signup'>Sign up now!</a>
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signin;
