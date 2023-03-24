import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import classes from './Article.module.scss';
import ArticleButtons from '../ArticleButtons/ArticleButtons';
import ArticleInfo from '../ArticleInfo/ArticleInfo';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import { getArticle } from '../../store';

function Article() {
  const dispatch = useDispatch();

  const article = useSelector((state) => state.openedArticle.article);
  const error = useSelector((state) => state.openedArticle.error);
  const isAuthorized = useSelector((state) => state.authorization.userName);
  const token = useSelector((state) => state.authorization.token);

  const isAllowInteract = article?.author.username === isAuthorized;

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getArticle({ slug, token: isAuthorized ? token : null }));
  }, [isAuthorized]);

  if (!article) return <Loader />;

  if (error) return <ErrorMessage />;

  return (
    <article className={classes.article}>
      <header className={classes.info}>
        <ArticleInfo data={article} mod={'opened'} />
        {isAllowInteract && <ArticleButtons />}
      </header>
      <ReactMarkdown
        className={classes.body}
        children={article?.body}
        remarkPlugins={[remarkGfm]}
      />
    </article>
  );
}

export default Article;
