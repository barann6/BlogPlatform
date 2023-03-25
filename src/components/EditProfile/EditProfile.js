import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './EditProfile.module.scss';
import Loader from '../Loader/Loader';
import { updateUserData, clearAuthorizationErrors } from '../../store';

function EditProfile() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(clearAuthorizationErrors());
  }, []);

  const token = useSelector((state) => state.authorization.token);
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);
  const serverErrors = useSelector((state) => state.authorization.errors);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    setNameError(!!serverErrors?.username)
    setEmailError(!!serverErrors?.email)
  }, [serverErrors])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors: formErrors, isValid },
  } = useForm({ mode: 'onBlur' });

  if (isLoading) return <Loader />;
  if (!isAuthorize) return <Redirect to="/BlogPlatform/sign-in/" />;

  const onSubmit = (data) => {
    const user = {};
    for (let field in data) {
      if (data[field]) user[field] = data[field];
    }
    dispatch(
      updateUserData({
        token,
        user,
        cb: () => {
          reset();
        },
      })
    );
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Profile</h2>

      <label>Username</label>
      <input
        placeholder="Username"
        {...register('username', {
          minLength: 3,
          maxLength: 20,
          onChange: () => setNameError(false),
        })}
        className={
          formErrors?.username || nameError ? classes.invalid : undefined
        }
      />
      {(formErrors?.username && (
        <section className={classes.warrning}>
          Your name needs to be at least 3 and not longer then 20 characters.
        </section>
      )) ||
        (nameError && (
          <section className={classes.warrning}>
            This name is already taken.
          </section>
        ))}

      <label>Email address</label>
      <input
        placeholder="Email address"
        {...register('email', {
          pattern: /\S+@\S+\.\S+/,
          onChange: () => setEmailError(false),
        })}
        className={
          formErrors?.email || emailError ? classes.invalid : undefined
        }
      />
      {(formErrors?.email && (
        <section className={classes.warrning}>
          Entered value does not match email format.
        </section>
      )) ||
        (emailError && (
          <section className={classes.warrning}>
            This email is already taken.
          </section>
        ))}

      <label>New password</label>
      <input
        type="password"
        placeholder="New password"
        {...register('password', {
          minLength: 6,
          maxLength: 40,
        })}
        className={formErrors?.password ? classes.invalid : undefined}
      />
      {formErrors?.password && (
        <section className={classes.warrning}>
          Your password needs to be at least 6 and not longer then 40
          characters.
        </section>
      )}

      <label>Avatar image (url)</label>
      <input
        placeholder="Avatar image"
        {...register('image', {
          pattern:
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        })}
        className={formErrors?.avatarImage ? classes.invalid : undefined}
      />
      {formErrors?.image && (
        <section className={classes.warrning}>
          Entered value does not match url format.
        </section>
      )}

      <input
        type="submit"
        value="Save"
        disabled={
          !isValid ||
          !watch(['username', 'email', 'password', 'image']).reduce(
            (pr, cr) => pr || cr
          )
        }
      />
    </form>
  );
}

export default EditProfile;
