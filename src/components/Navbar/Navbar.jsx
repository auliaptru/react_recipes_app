import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';

import './navbar.scss';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const { user } = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // close dropdown automatically
        const handleClickDropdown = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickDropdown);
        return () => {
            document.removeEventListener('click', handleClickDropdown);
        };
    }, []);

    const handleSignout = async () => {
        try {
            await signOut(auth);
            toast.success('Sign-out successfully!');
        } catch (error) {
            toast.error("There's something wrong.");
        }
    };

    return (
        <nav className='navbar'>
            <div className='nav__wrapper'>
                <Link to='/' className='nav__logo link'>
                    <img
                        src='https://cdn.pixabay.com/photo/2020/09/26/08/36/logo-5603463_1280.png'
                        alt='logoC'
                    />
                    <span>ookShare</span>
                </Link>
                <ul className='nav__items'>
                    <Link to={user ? '/upload' : '/signin'} className='link'>
                        <li>Upload your recipe</li>
                    </Link>
                    {user && (
                        <li onClick={() => setOpen(!open)} ref={dropdownRef}>
                            Welcome, {user.displayName}
                        </li>
                    )}
                    {open && (
                        <div className='nav__dropdown'>
                            <Link to={`/profile/${user.uid}`} className='link'>
                                <li onClick={() => setOpen(false)}>
                                    My Profile
                                </li>
                            </Link>
                            <li onClick={handleSignout}>Sign out</li>
                        </div>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
