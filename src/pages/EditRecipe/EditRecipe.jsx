import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useStorage from '../../hooks/useStorage';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import loadingGif from '../../assets/loading.gif';
import './editRecipe.scss';

const updateData = {
    newTitle: '',
    newDesc: '',
    newIngredients: '',
    newTutorials: '',
    newDuration: '',
    newCategory: '',
};

const EditRecipe = () => {
    const [editState, setEditState] = useState(updateData);
    const [recipeData, setRecipeData] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { uploadFile, progress, state } = useStorage();
    const { id } = useParams();
    const prevFileRef = useRef(null);
    const navigate = useNavigate('');

    const {
        newTitle,
        newDesc,
        newIngredients,
        newTutorials,
        newDuration,
        newCategory,
    } = editState;

    const getRecipeDetail = async () => {
        const docRef = doc(db, 'recipes', id);
        try {
            setLoading(true);
            const recipeSnapshot = await getDoc(docRef);

            if (recipeSnapshot.exists()) {
                const recipeDetail = recipeSnapshot.data();
                setRecipeData(recipeDetail);
                setLoading(false);
            } else {
                console.log('Not found');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (file && file !== prevFileRef.current) {
            uploadFile(file, 'recipe');
            prevFileRef.current = file;
        }
        id && getRecipeDetail();
    }, [file, id]);

    const handleChangeState = (e) => {
        setEditState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleChangeCategory = (e) => {
        setEditState((prev) => ({ ...prev, newCategory: e.target.value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recipeDocRef = doc(db, 'recipes', id);
        try {
            const currentBlogData = (await getDoc(recipeDocRef)).data();

            const updateRecipe = {
                ...state,
                title: newTitle || currentBlogData.title,
                desc: newDesc || currentBlogData.desc,
                ingredients: newIngredients || currentBlogData.ingredients,
                tutorials: newTutorials || currentBlogData.tutorials,
                duration: newDuration || currentBlogData.duration,
                category: newCategory || currentBlogData.category,
            };
            await updateDoc(recipeDocRef, updateRecipe);
            toast.success('Edit recipe successfully');

            navigate(`/recipe/${recipeData.title}/${id}`);
        } catch (error) {
            console.log(error);
        }
        setFile(null);
    };

    return (
        <>
            {loading ? (
                <div className='loading__container'>
                    <img src={loadingGif} alt='' />
                </div>
            ) : (
                <div className='editRecipe'>
                    <div className='editRecipe__wrapper'>
                        <h2>Edit Recipe</h2>
                        <form onSubmit={handleSubmit}>
                            {/* WRITE RECIPE */}
                            <label htmlFor='title-recipe'>Title Recipe</label>
                            <input
                                type='text'
                                placeholder={recipeData.title}
                                id='title-recipe'
                                name='newTitle'
                                defaultValue={recipeData.title}
                                onChange={handleChangeState}
                                required
                            />

                            {/* DESCRIPTION RECIPE  */}
                            <label htmlFor='desc-recipe'>Description</label>
                            <textarea
                                name='newDesc'
                                id='desc-recipe'
                                rows='3'
                                placeholder={recipeData.desc}
                                defaultValue={recipeData.desc}
                                onChange={handleChangeState}
                                required
                            />

                            {/* INGREDIENTS RECIPE */}
                            <label htmlFor='ingredients'>Ingredients</label>
                            <textarea
                                id='ingredients'
                                name='newIngredients'
                                rows='5'
                                placeholder={recipeData.ingredients}
                                defaultValue={recipeData.ingredients}
                                onChange={handleChangeState}
                                required
                            />

                            {/* TUTORIAL RECIPE */}
                            <label htmlFor='tutorials'>Steps how to cook</label>
                            <textarea
                                id='tutorials'
                                name='newTutorials'
                                rows='5'
                                placeholder={recipeData.tutorials}
                                defaultValue={recipeData.tutorials}
                                onChange={handleChangeState}
                                required
                            />

                            {/* DURATION COOKING */}
                            <label>Duration</label>
                            <input
                                type='number'
                                name='newDuration'
                                id='duration'
                                placeholder={recipeData.duration}
                                defaultValue={recipeData.duration}
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
                                        checked={newCategory === 'appetizer'}
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
                                        checked={newCategory === 'dessert'}
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
                                        checked={newCategory === 'mainCourse'}
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
                                        checked={newCategory === 'beverage'}
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
                                        checked={newCategory === 'snack'}
                                        onChange={handleChangeCategory}
                                    />
                                    Snack
                                </label>
                            </div>

                            {/* PHOTO RECIPE */}
                            <label htmlFor='photo-recipe'>
                                Photo of your cooking
                            </label>
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
                                Edit Recipe
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditRecipe;
