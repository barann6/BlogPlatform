import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import classes from './App.module.scss';
import Article from '../Article/Article';
import ArticlesList from '../ArticlesList/ArticlesList';
import CreateArticle from '../CreateArticle/CreateArticle';
import EditArticle from '../EditArticle/EditArticle';
import EditProfile from '../EditProfile/EditProfile';
import Layout from '../Layout/Layout';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import { getUserData } from '../../store/authorization';

function App() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.authorization.token);

  useEffect(() => {
    dispatch(getUserData(token));
  }, []);

  return (
    <Router>
      <Layout />
      <main className={classes.main}>

        <Switch>
          <Route path="/BlogPlatform/" exact component={ArticlesList} />

          <Route path="/BlogPlatform/new-article/" component={CreateArticle} />

          <Route path="/BlogPlatform/articles/:slug/edit/" component={EditArticle} />

          <Route path="/BlogPlatform/articles/:slug" component={Article} />

          <Route path="/BlogPlatform/articles/" component={ArticlesList} />

          <Route path="/BlogPlatform/sign-up/" component={SignUp} />

          <Route path="/BlogPlatform/sign-in/" component={SignIn} />

          <Route path="/BlogPlatform/profile/" component={EditProfile} />

          <Redirect to="/BlogPlatform/" component={ArticlesList} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
