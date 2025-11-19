import Home from './pages/Home';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Recipes from './pages/Recipes';
import Progresso from './pages/Progresso';
import Saude from './pages/Saude';
import FoodLibrary from './pages/FoodLibrary';
import BemEstar from './pages/BemEstar';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "Workouts": Workouts,
    "ExerciseLibrary": ExerciseLibrary,
    "Recipes": Recipes,
    "Progresso": Progresso,
    "Saude": Saude,
    "FoodLibrary": FoodLibrary,
    "BemEstar": BemEstar,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};