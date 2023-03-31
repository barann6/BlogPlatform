import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import classes from './ArticleInfo.module.scss';
import blogPlatformService from '../../service/blogPlatformService';
import placeholder from '../../images/placeholder.jpg';

function ArticleInfo({ data, mod }) {
  const {
    slug,
    title,
    favoritesCount,
    favorited,
    author,
    tagList,
    createdAt,
    description,
  } = data;

  const [_favoritesCount, setFavoritesCount] = useState(favoritesCount);
  const [_favorited, setFavorited] = useState(favorited);

  const isAuthorized = !!useSelector((state) => state.authorization.userName);
  const token = useSelector((state) => state.authorization.token);

  const tagListDisplay = tagList.map((tag, i) => (
    <li className={[classes.tag, classes[`tag_${mod}`]].join(' ')} key={i}>
      {tag}
    </li>
  ));

  const createdAtDisplay = format(new Date(createdAt), 'MMMM d, yyyy');

  const like = async () => {
    try {
      const resp = await blogPlatformService.favoriteArticle(
        slug,
        token,
        _favorited
      );
      if (resp.ok) {
        setFavoritesCount(_favoritesCount + (_favorited ? -1 : 1));
        setFavorited(!_favorited);
      }
    } catch {
      return;
    }
  };

  return (
    <>
      <div className={classes.header}>
        <Link
          className={[classes.title, classes[`title_${mod}`]].join(' ')}
          to={`/articles/${data.slug}`}>
          {title}
        </Link>

        <button
          className={[
            classes['like-button'],
            classes[!_favorited ? 'like-button_liked' : 'like-button_no-liked'],
          ].join(' ')}
          onClick={isAuthorized ? like : undefined}>
          {_favoritesCount}
        </button>
      </div>

      <section className={classes.username}>{author.username}</section>

      <img
        className={classes.avatar}
        src={author.image}
        alt="author avatar"
        onError={(e) => (e.target.src = placeholder)}
      />

      <ul className={[classes.tags, classes[`tags_${mod}`]].join(' ')}>
        {tagListDisplay}
      </ul>

      <section className={classes.created}>{createdAtDisplay}</section>
      <section
        className={[classes.description, classes[`description_${mod}`]].join(
          ' '
        )}>
        {description}
      </section>
    </>
  );
}

export default ArticleInfo;
