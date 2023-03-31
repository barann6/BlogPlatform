import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from 'react-router';

import { editeArticle, getArticle } from '../../store';
import ArticleForm from '../ArticleForm/ArticleForm';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import { SIGNIN } from '../../routing_paths';

const EditArticle = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { slug } = useParams();

  const token = useSelector((state) => state.authorization.token);
  useDispatch(getArticle(slug));
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);
  const article = useSelector((state) => state.openedArticle.article);
  const error = useSelector((state) => state.openedArticle.error);

  if (isLoading) return <Loader />;
  if (!isAuthorize) return <Redirect to={SIGNIN} />;
  if (error) return <ErrorMessage />;

  return (
    <ArticleForm
      title={article?.title}
      description={article?.description}
      body={article?.body}
      tags={article?.tagList}
      componentTitle="Edit article"
      errorMessage="Failed to edit an article."
      onSubmit={async (input) => {
        const data = {};
        for (let field in input) {
          if (input[field]) data[field] = input[field];
        }
        dispatch(
          editeArticle({
            token,
            data,
            slug,
            cb: () => {
              history.push('/');
            },
          })
        );
      }}
    />
  );
};

export default EditArticle;
