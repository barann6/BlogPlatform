import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classes from './ArticlesList.module.scss';
import ArticleInfo from '../ArticleInfo/ArticleInfo';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import Pagination from '../Pagination/Pagination';
import { getArticlesList } from '../../store';

function ArticlesList() {
  const dispatch = useDispatch();

  const isAuthorized = useSelector((state) => state.authorization.userName);
  const token = useSelector((state) => state.authorization.token);
  const articles = useSelector((state) => state.articlesList.articles);
  const error = useSelector((state) => state.articlesList.error);

  useEffect(() => {
    dispatch(getArticlesList({ pageNumber: 1, token: isAuthorized ? token : null }));
  }, [isAuthorized]);

  if (!articles) return <Loader />;

  if (error) return <ErrorMessage />;

  return (
    <>
      <ul className={classes.list}>
        {articles.map((article) => (
          <li key={article.slug}>
            <article className={classes.info}>
              <ArticleInfo data={article} mod={'list'} />
            </article>
          </li>
        ))}
      </ul>
      <Pagination token={isAuthorized && token}/>
    </>
  );
}

export default ArticlesList;
