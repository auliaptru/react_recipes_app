import { Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PropTypes from 'prop-types';

import Card from '../Card/Card';
import './cardWrapper.scss';

const CardWrapper = ({
    title,
    data,
    btn,
    click,
    setClick,
    handleAllRecipes,
}) => {
    // Number of clicks when users click on the recipe card
    const handleClickCount = async (recipeId) => {
        const recipeRef = doc(db, 'recipes', recipeId);
        const recipeDoc = await getDoc(recipeRef);

        if (!recipeDoc.exists()) {
            return;
        }

        try {
            const newClickCount = (recipeDoc.data().clickCount || 0) + 1;
            await updateDoc(recipeRef, { clickCount: newClickCount });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='cardWrapper'>
            <div className='cardWrapper__title'>
                <h2>{title}</h2>
                {btn && (
                    <div onClick={() => handleAllRecipes(title)}>
                        {click ? (
                            <button
                                className='btn'
                                onClick={() => setClick(false)}
                            >
                                Back
                            </button>
                        ) : (
                            <button className='btn'>See All</button>
                        )}
                    </div>
                )}
            </div>

            <div className='cardWrapper__cards'>
                {data?.map((item) => {
                    const decodedTitle = decodeURIComponent(
                        item.title
                    ).toLowerCase();
                    const formattedTitle = decodedTitle.replace(/\s+/g, '-');
                    return (
                        <div className='cardWrapper__card' key={item.id}>
                            <Link
                                to={`/recipe/${formattedTitle}/${item.id}`}
                                onClick={() => handleClickCount(item.id)}
                            >
                                <Card item={item} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

CardWrapper.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    btn: PropTypes.bool.isRequired,
    click: PropTypes.bool.isRequired,
    setClick: PropTypes.func.isRequired,
    handleAllRecipes: PropTypes.func.isRequired,
};

export default CardWrapper;
