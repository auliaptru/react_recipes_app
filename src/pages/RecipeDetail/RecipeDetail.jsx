import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { MdDelete, MdEdit } from 'react-icons/md';
import { deleteObject, ref } from 'firebase/storage';

import loadingGif from '../../assets/loading.gif';
import './recipeDetail.scss';

const RecipeDetail = () => {
    const [recipeData, setRecipeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

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
        id && getRecipeDetail();
    }, [id]);

    const {
        title,
        author,
        category,
        desc,
        duration,
        imgUrl,
        ingredients,
        tutorials,
        timestamp,
        profileImg,
        userId,
    } = recipeData;

    // change \n to enter
    const ingArray = ingredients?.split('\n');
    let isTitle = false;

    const formattedIngredients = ingArray?.map((list) => {
        if (list.endsWith(':')) {
            isTitle = true;
            return list;
        } else {
            isTitle = false;
            // Add '-' to ingredients list
            return isTitle ? list : `- ${list}`;
        }
    });

    const ingredientsList = formattedIngredients?.join('\n');
    const ingredientsData = ingredientsList?.split('\n');

    // Add number to tutorial lists
    const tutorialsArray = tutorials?.split('\n');
    let currentNumber = 1;

    const formattedTutorials = tutorialsArray?.map((list) => {
        // list after text with ':' add number from 1
        if (list.endsWith(':')) {
            currentNumber = 1;
            return list;
        } else {
            const formattedLine = `${currentNumber}. ${list}`;
            currentNumber++;
            return formattedLine;
        }
    });

    const tutorialsList = formattedTutorials?.join('\n');
    const tutorialsData = tutorialsList?.split('\n');

    const owner = user && user.uid === userId;

    const getCategory = (category) => {
        if (category === 'mainCourse') {
            return 'Main Course';
        } else if (category === 'desser') {
            return 'Dessert';
        }
        if (category === 'appetizer') {
            return 'Appetizer';
        }
    };

    const handleDelete = async (id) => {
        // firebase image URL
        const firebaseImgUrl =
            /^https?:\/\/firebasestorage\.googleapis\.com\/v0\/b\/cookshare-21493\.appspot\.com\/o\//;

        // replace url into '' => images%2Ffb984d9b-26fb-4c45-9e17-5f8166c99661.webp?alt=media&token=token
        const imgUrlWithoutDomain = imgUrl?.replace(firebaseImgUrl, '');

        // changes %2F into 'images,fb9...' and take the last array with pop (fb9..),
        // split between 'fb9...' and '?alt=media...', then take the first array with [0] ('fb9..' /image's name)
        const imageName = decodeURIComponent(
            imgUrlWithoutDomain?.split('%2F').pop().split('?')[0]
        );

        if (imageName) {
            const imageRef = ref(storage, `images/${imageName}`);
            // delete image in storage firebase
            await deleteObject(imageRef);
        }
        // delete recipe by id in recipes collection
        await deleteDoc(doc(db, 'recipes', id));
        navigate('/');
    };

    return (
        <>
            {loading ? (
                <div className='loading__container'>
                    <img src={loadingGif} alt='' />
                </div>
            ) : (
                <div className='recipeDetail'>
                    <div className='recipeDetail__wrapper'>
                        <div className='recipe__img'>
                            <h1 className='recipe__title'>{title}</h1>
                            <div className='recipe__cate'>
                                <p>Category: {getCategory(category)}</p>
                                <p>Time: {duration} Minutes</p>
                            </div>
                            <img src={imgUrl} alt='' />
                        </div>
                        <div className='recipe__details'>
                            <div className='recipe__user-container'>
                                <div className='recipe__user'>
                                    <div className='profile__img'>
                                        {profileImg ? (
                                            <img src={profileImg} alt='' />
                                        ) : (
                                            <h2>{author?.charAt()}</h2>
                                        )}
                                    </div>
                                    <div className='recipe__user-wrapper'>
                                        <h4>{author}</h4>
                                        <p>
                                            {timestamp?.toDate().toDateString()}
                                        </p>
                                    </div>
                                </div>
                                {owner && (
                                    <div className='recipe__icons'>
                                        <div
                                            className='icon'
                                            onClick={() => {
                                                navigate(`/recipe/${id}/edit`);
                                            }}
                                        >
                                            <MdEdit />
                                        </div>
                                        <div
                                            className='icon'
                                            onClick={() => {
                                                const confirmDelete =
                                                    window.confirm(
                                                        'Are you sure you want to delete this recipe?'
                                                    );
                                                if (confirmDelete) {
                                                    handleDelete(id);
                                                }
                                            }}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p>{desc}</p>
                            <div className='recipe__ingredients'>
                                <h3>Ingredients:</h3>
                                <ul className='list'>
                                    {ingredientsData?.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className='recipe__tutorials'>
                                <h3>Tutorials</h3>
                                <ol className='list tutorial'>
                                    {tutorialsData?.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeDetail;
