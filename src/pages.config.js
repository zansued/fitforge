import Home from './pages/Home';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Recipes from './pages/Recipes';
import Progresso from './pages/Progresso';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "Workouts": Workouts,
    "ExerciseLibrary": ExerciseLibrary,
    "Recipes": Recipes,
    "Progresso": Progresso,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};