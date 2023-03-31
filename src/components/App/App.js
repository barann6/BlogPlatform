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
import {
  LIST,
  ARTICLE,
  EDIT,
  CREATE,
  PROFILE,
  SIGNIN,
  SIGNUP,
} from '../../routing_paths';

function App() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.authorization.token);

  useEffect(() => {
    dispatch(getUserData(token));
  }, []);

  return (
    <Router basename="/BlogPlatform">
      <Layout />
      <main className={classes.main}>
        <Switch>
          <Route path="/" exact component={ArticlesList} />

          <Route path={CREATE} component={CreateArticle} />

          <Route path={EDIT} component={EditArticle} />

          <Route path={ARTICLE} component={Article} />

          <Route path={LIST} exact component={ArticlesList} />

          <Route path={SIGNUP} component={SignUp} />

          <Route path={SIGNIN} component={SignIn} />

          <Route path={PROFILE} component={EditProfile} />

          <Redirect to="/" component={ArticlesList} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
