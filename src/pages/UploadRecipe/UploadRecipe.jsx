import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import useStorage from '../../hooks/useStorage';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

import './uploadRecipe.scss';

const UploadRecipe = () => {
    const [file, setFile] = useState(null);

    const { user } = useAuth();
    const { uploadFile, progress, state, setState } = useStorage();
    const prevFileRef = useRef(null);
    const navigate = useNavigate();

    const { title, desc, ingredients, tutorials, duration, category } = state;

    useEffect(() => {
        if (file && file !== prevFileRef.current) {
            uploadFile(file, 'recipe');
            prevFileRef.current = file;
        }
    }, [file]);

    const handleChangeState = (e) => {
        const value = e.target.value;
        // preventing double line breaks
        const cleanedInputValue = value.replace(/\n\s*\n/g, '\n');
        setState({ ...state, [e.target.name]: cleanedInputValue });
    };

    const handleChangeCategory = (e) => {
        setState({ ...state, category: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && desc && ingredients && tutorials && duration && category) {
            try {
                await addDoc(collection(db, 'recipes'), {
                    ...state,
                    timestamp: serverTimestamp(),
                    author: user.displayName,
                    userId: user.uid,
                    profileImg: user.photoURL,
                    title: title.toLowerCase(),
                });
                toast.success('Upload recipe successfully');
                navigate('/');
            } catch (error) {
                console.log(error);
            }
        }
        setFile(null);
    };
    return (
        <div className='uploadRecipe'>
            <div className='uploadRecipe__wrapper'>
                <h2>Write Recipe</h2>
                <form onSubmit={handleSubmit}>
                    {/* WRITE RECIPE */}
                    <label htmlFor='title-recipe'>Title Recipe</label>
                    <input
                        type='text'
                        placeholder='Write the name of your recipe'
                        id='title-recipe'
                        name='title'
                        value={title}
                        onChange={handleChangeState}
                        // required
                    />

                    {/* DESCRIPTION RECIPE  */}
                    <label htmlFor='desc-recipe'>Description</label>
                    <textarea
                        name='desc'
                        id='desc-recipe'
                        rows='3'
                        placeholder='Example: a delicious recipe passed down from my family...'
                        value={desc}
                        onChange={handleChangeState}
                        // required
                    />

                    {/* INGREDIENTS RECIPE */}
                    <label htmlFor='ingredients'>Ingredients</label>
                    <textarea
                        id='ingredients'
                        name='ingredients'
                        rows='5'
                        placeholder='Please enter each ingredient'
                        value={ingredients}
                        onChange={handleChangeState}
                        // required
                    />

                    {/* TUTORIAL RECIPE */}
                    <label htmlFor='tutorials'>Steps how to cook</label>
                    <textarea
                        id='tutorials'
                        name='tutorials'
                        rows='5'
                        placeholder='Please enter each tutorial '
                        value={tutorials}
                        onChange={handleChangeState}
                        // required
                    />

                    {/* DURATION COOKING */}
                    <label>Duration</label>
                    <input
                        type='number'
                        name='duration'
                        id='duration'
                        placeholder='Cooking duration'
                        value={duration}
                        onChange={handleChangeState}
                    />

                    {/* CATEGORIES RECIPE */}
                    <label>Category</label>
                    <div className='recipe__categories' id='category'>
                        <label htmlFor='appetizer'>
                            <input
                                type='radio'
                                name='checkOpt'
                                id='appetizer'
                                value='appetizer'
                                checked={category === 'appetizer'}
                                onChange={handleChangeCategory}
                            />
                            Appetizers
                        </label>
                        <label htmlFor='dessert'>
                            <input
                                type='radio'
                                name='checkOpt'
                                id='dessert'
                                value='dessert'
                                checked={category === 'dessert'}
                                onChange={handleChangeCategory}
                            />
                            Dessert
                        </label>
                        <label htmlFor='mainCourse'>
                            <input
                                type='radio'
                                name='checkOpt'
                                id='mainCourse'
                                value='mainCourse'
                                checked={category === 'mainCourse'}
                                onChange={handleChangeCategory}
                            />
                            Main Course
                        </label>
                        <label htmlFor='beverage'>
                            <input
                                type='radio'
                                name='checkOpt'
                                id='beverage'
                                value='beverage'
                                checked={category === 'beverage'}
                                onChange={handleChangeCategory}
                            />
                            Beverage
                        </label>
                        <label htmlFor='snack'>
                            <input
                                type='radio'
                                name='checkOpt'
                                id='snack'
                                value='snack'
                                checked={category === 'snack'}
                                onChange={handleChangeCategory}
                            />
                            Snack
                        </label>
                    </div>

                    {/* PHOTO RECIPE */}
                    <label htmlFor='photo-recipe'>Photo of your cooking</label>
                    <input
                        type='file'
                        name='photo-recipe'
                        id='photo-recipe'
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
                        Upload Recipe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadRecipe;
