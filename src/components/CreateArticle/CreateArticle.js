import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router';

import ArticleForm from '../ArticleForm/ArticleForm';
import Loader from '../Loader/Loader';
import { postArticle } from '../../store';

const CreateArticle = () => {
  const dispatch = useDispatch();
  
  const history = useHistory();

  const token = useSelector((state) => state.authorization.token);
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);

  if (isLoading) return <Loader />;
  if (!isAuthorize) return <Redirect to="/BlogPlatform/sign-in/" />;

  return (
    <ArticleForm
      componentTitle="Create new article"
      errorMessage="Failed to create an article."
      onSubmit={async (input) => {
        const data = {};
        for (let field in input) {
          if (input[field] && input[field].length !== 0)
            data[field] = input[field];
        }
        dispatch(
          postArticle({
            token,
            data,
            cb: () => {
              history.push('/BlogPlatform/');
            },
          })
        );
      }}
    />
  );
};

export default CreateArticle;
