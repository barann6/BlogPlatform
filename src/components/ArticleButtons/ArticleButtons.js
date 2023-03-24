import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import classes from './ArticleButtons.module.scss';
import { deleteArticle } from '../../store';

const ArticleButtons = () => {
  const dispatch = useDispatch();

  const [popupOpened, setPopupOpened] = useState(false);

  const token = useSelector((state) => state.authorization.token);
  const slug = useSelector((state) => state.openedArticle.article.slug);

  const history = useHistory();

  useEffect(() => {
    const closePopup = (e) => {
      if (
        e.target.nodeName !== 'BUTTON' &&
        e.target.className !== classes.popup
      )
        setPopupOpened(false);
    };
    window.addEventListener('click', closePopup);
    return () => window.removeEventListener('click', closePopup);
  });

  return (
    <div className={classes.buttons}>
      <button onClick={() => setPopupOpened(!popupOpened)}>Delete</button>

      {popupOpened && (
        <div className={classes.popup}>
          Are you sure to delete this article?
          <div>
            <button
              onClick={() => {
                dispatch(
                  deleteArticle({
                    token,
                    slug,
                    data: null,
                    cb: () => {
                      history.push('/');
                    },
                  })
                );
              }}>
              Yes
            </button>
            <button onClick={() => setPopupOpened(false)}>No</button>
          </div>
        </div>
      )}

      <button onClick={() => history.push(`/articles/${slug}/edit/`)}>
        Edit
      </button>
    </div>
  );
};

export default ArticleButtons;
