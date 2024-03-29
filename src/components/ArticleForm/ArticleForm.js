import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';

import classes from './ArticleForm.module.scss';
import { clearArticleError } from '../../store';

const ArticleForm = ({
  componentTitle,
  errorMessage,
  onSubmit,
  title,
  description,
  body,
  tags = [],
}) => {
  const newTagField = useRef(null);

  useEffect(() => {
    dispatch(clearArticleError());
  }, []);
  
  const dispatch = useDispatch();

  const error = useSelector((state) => state.openedArticle.error);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { title, description, body, tagList: [...tags] },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'tagList',
  });

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>{componentTitle}</h2>

      <label>Title</label>
      <input
        placeholder={errors?.title ? 'Requied' : 'Important Article Title'}
        {...register('title', {
          required: true,
        })}
        className={errors?.title ? classes.invalid : undefined}></input>

      <label>Short description</label>
      <input
        placeholder={
          errors?.description
            ? 'Requied'
            : 'Some short description that displays in atricles list'
        }
        {...register('description', {
          required: true,
        })}
        className={errors?.description ? classes.invalid : undefined}></input>

      <label>Text</label>
      <textarea
        rows={6}
        placeholder={errors?.body ? 'Requied' : 'Text (Use markdown)'}
        {...register('body', {
          required: true,
        })}
        className={errors?.body ? classes.invalid : undefined}></textarea>

      <label>Tags</label>
      <ul>
        {fields.map((tag, index) => {
          return (
            <li key={tag.id}>
              <input
                placeholder={errors?.tagList ? 'Requied' : 'Tag'}
                {...register(`tagList[${index}]`, {
                  required: true,
                })}
                className={
                  errors?.tagList && index === fields.length - 1
                    ? classes.invalid
                    : undefined
                }
              />
              <button
                type="button"
                className={classes.delete}
                onClick={() => remove(index)}>
                Delete
              </button>
              {index < fields.length - 1 ? null : (
                <button
                  type="button"
                  className={classes.add}
                  onClick={() => append('')}>
                  Add tag
                </button>
              )}
            </li>
          );
        })}
        {fields.length === 0 && (
          <li>
            <input placeholder="Tag" ref={newTagField} />
            <button
              type="button"
              className={classes.add}
              onClick={() => {
                if (newTagField.current.value)
                  append(newTagField.current.value);
                else newTagField.current.focus();
              }}>
              Add tag
            </button>
          </li>
        )}
      </ul>

      <input type="submit" disabled={!isValid}></input>
      {error && <section className={classes.warrning}>{errorMessage}</section>}
    </form>
  );
};

export default ArticleForm;
