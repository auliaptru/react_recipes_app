import {
    MdOutlineTimer,
    MdOutlineRemoveRedEye,
    MdOutlineBookmarkAdd,
    MdEdit,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './card.scss';

const Card = ({ item }) => {
    const { user } = useAuth();
    const owner = user && user.uid === item.userId;

    const { imgUrl, profileImg, author, duration, title, clickCount, id } =
        item;

    return (
        <div className='card'>
            <div className='recipe__img'>
                <img src={imgUrl} alt='' />
            </div>
            <div className='card__profile'>
                <div className='card__wrapper'>
                    <div className='profile__img'>
                        {profileImg ? (
                            <img src={profileImg} alt='' />
                        ) : (
                            <h2>{author.charAt()}</h2>
                        )}
                    </div>
                    <h2 className='profile__name'>{author}</h2>
                </div>
                <div className='card__time'>
                    <MdOutlineTimer className='timerIcon' />
                    <p>{duration} Mins</p>
                </div>
            </div>
            <h4 className='card__title'>{title}</h4>
            <div className='card__icons'>
                <div className='icon__left'>
                    <MdOutlineRemoveRedEye className='icon view' />
                    <p>{clickCount}</p>
                </div>
                <div className='icon__right'>
                    {!owner ? (
                        <MdOutlineBookmarkAdd className='icon' />
                    ) : (
                        <Link to={`recipe/${id}/edit`}>
                            <MdEdit className='icon edit' />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    item: PropTypes.object.isRequired,
};

export default Card;
