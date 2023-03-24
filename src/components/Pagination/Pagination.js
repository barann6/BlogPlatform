import { useSelector, useDispatch } from 'react-redux';

import classes from './Pagination.module.scss';
import { togglePage, getArticlesList } from '../../store';

function Pagination({ token }) {
  const dispatch = useDispatch();

  const totalPages = useSelector((state) =>
    Math.ceil(state.articlesList.totalArticles / 5)
  );
  const currentPage = useSelector((state) => state.articlesList.currentPage);

  if (!totalPages) return null;

  const pageNumbersButtons = [];

  const onClick = (number, condition) =>
    condition
      ? () => {
          dispatch(togglePage(number));
          dispatch(
            getArticlesList({ pageNumber: number, token: token || null })
          );
        }
      : undefined;

  const addButton = (number) => {
    pageNumbersButtons.push(
      <li key={number}>
        <button
          className={number === currentPage ? classes.current : undefined}
          onClick={onClick(number, number !== currentPage)}>
          {number}
        </button>
      </li>
    );
  };

  if (currentPage <= 3) {
    for (let i = 1; i <= 5 && i <= totalPages; i++) {
      addButton(i);
    }
  } else if (currentPage <= totalPages - 2) {
    for (let i = -2; i < 3 && currentPage + i <= totalPages; i++) {
      addButton(currentPage + i);
    }
  } else {
    for (let i = 4; i >= 0; i--) {
      addButton(totalPages - i);
    }
  }

  const arrowButton = (arrow, direction, condition) => {
    condition = currentPage !== condition;
    return (
      <li>
        <button
          className={condition ? undefined : classes.disabled}
          onClick={onClick(currentPage + direction, condition)}>
          {arrow}
        </button>
      </li>
    );
  };

  return (
    <ul className={classes.pagination}>
      {arrowButton('<', -1, 1)}
      {pageNumbersButtons}
      {arrowButton('>', 1, totalPages)}
    </ul>
  );
}

export default Pagination;
