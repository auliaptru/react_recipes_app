import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';

import Home from './pages/Home';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import UploadRecipe from './pages/UploadRecipe/UploadRecipe';
import Navbar from './components/Navbar/Navbar';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import MyProfile from './pages/MyProfile/MyProfile';
import EditRecipe from './pages/EditRecipe/EditRecipe';

const App = () => {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/upload' element={<UploadRecipe />} />
                <Route path='/profile/:id' element={<MyProfile />} />
                <Route path='/recipe/:title/:id' element={<RecipeDetail />} />
                <Route path='/recipe/:id/edit' element={<EditRecipe />} />
            </Routes>
        </AuthProvider>
    );
};

export default App;
