import PropTypes from 'prop-types';

import './search.scss';

const Search = ({ search, query, setQuery, setSearchResults, setClick }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        search(query);
    };

    const handleInput = (e) => {
        setQuery(e.target.value);
        if (!e.target.value) {
            setSearchResults([]);
            setClick(false);
        }
    };

    return (
        <div className='search' onSubmit={handleSubmit}>
            <form>
                <input
                    type='search'
                    placeholder='Search recipe...'
                    value={query}
                    onChange={handleInput}
                />
                <button type='submit'>Search</button>
            </form>
        </div>
    );
};

Search.propTypes = {
    search: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    setSearchResults: PropTypes.func.isRequired,
    setClick: PropTypes.func.isRequired,
};

export default Search;
