import CardWrapper from '../components/CardWrapper/CardWrapper';
import useFirestore from '../hooks/useFirestore';
import loadingGif from '../assets/loading.gif';
import Search from '../components/Search/Search';
import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

import './home.scss';

const Home = () => {
    const [query, setQuery] = useState('');
    const [click, setClick] = useState(false);
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const search = async (keyword) => {
        const recipesRef = collection(db, 'recipes');

        if (keyword) {
            const querySnapshot = await getDocs(recipesRef);
            const recipes = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.title.toLowerCase().includes(keyword)) {
                    recipes.push({ id: doc.id, ...data });
                }
            });
            setSearchResults(recipes);
        }
    };

    const { formData, loading } = useFirestore('recipes');

    const CookShareRecipes = formData
        .filter((recipe) => recipe.author === 'CookShare')
        .slice(0, 4);

    const anotherRecipes = formData
        .filter((recipe) => recipe.author !== 'CookShare')
        .slice(0, 4);

    const handleAllRecipes = (title) => {
        setClick(!click);
        if (title) {
            if (title === 'Recipes by CookShare') {
                setData(
                    formData.filter((recipe) => recipe.author === 'CookShare')
                );
            } else if (title === "Recipes from Various CookShare Friends's") {
                setData(
                    formData.filter((recipe) => recipe.author !== 'CookShare')
                );
            }
        }
    };

    return (
        <div className='home__wrapper'>
            <div className='home__title'>
                <h1>Taste the Dishes by CookShare Companions</h1>
                <p>
                    CookShare is an online platform that enables you to upload
                    and share your personal recipes with the world.
                    <br />
                    Happy sharing, learning, and creating new memories through
                    your special recipes!
                </p>
            </div>
            <div className='home__search'>
                <Search
                    search={search}
                    query={query}
                    setQuery={setQuery}
                    setSearchResults={setSearchResults}
                    setClick={setClick}
                />
            </div>

            {loading ? (
                <div className='loading__container'>
                    <img src={loadingGif} alt='' />
                </div>
            ) : (
                <div className='home__wrapper'>
                    <div className='home__recipes'>
                        {searchResults.length > 0 && query ? (
                            <CardWrapper
                                title='Search'
                                data={searchResults}
                                btn={false}
                            />
                        ) : (
                            <>
                                {click ? (
                                    <CardWrapper
                                        title='All Recipes'
                                        data={data}
                                        btn={true}
                                        click={click}
                                        setClick={setClick}
                                    />
                                ) : (
                                    <>
                                        <CardWrapper
                                            title='Recipes by CookShare'
                                            data={CookShareRecipes}
                                            btn={true}
                                            handleAllRecipes={handleAllRecipes}
                                        />
                                        <CardWrapper
                                            title="Recipes from Various CookShare Friends's"
                                            data={anotherRecipes}
                                            btn={true}
                                            handleAllRecipes={handleAllRecipes}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
