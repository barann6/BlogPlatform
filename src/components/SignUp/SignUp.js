import { useEffect, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './SignUp.module.scss';
import Loader from '../Loader/Loader';
import { clearAuthorizationErrors, signUp } from '../../store';

function SignUp() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(clearAuthorizationErrors());
  }, []);

  const serverErrors = useSelector((state) => state.authorization.errors);
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    setNameError(!!serverErrors?.username);
    setEmailError(!!serverErrors?.email);
  }, [serverErrors]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors: formErrors, isValid },
  } = useForm({ mode: 'onBlur' });

  if (isLoading) return <Loader />;
  if (isAuthorize) return <Redirect to="/" />;

  const onSubmit = ({ username, email, password }) => {
    dispatch(signUp({ username, email, password }));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new account</h2>

      <label>Username</label>
      <input
        placeholder="Username"
        {...register('username', {
          required: true,
          minLength: 3,
          maxLength: 20,
          onChange: () => setNameError(false),
        })}
        className={formErrors?.username ? classes.invalid : undefined}
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
          required: true,
          pattern: /\S+@\S+\.\S+/,
          onChange: () => setEmailError(false),
        })}
        className={formErrors?.email ? classes.invalid : undefined}
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

      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        {...register('password', {
          required: true,
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

      <label>Repeat Password</label>
      <input
        type="password"
        placeholder="Password"
        {...register('repeatPassword', {
          required: true,
          validate: (value) => value === watch('password'),
        })}
        className={formErrors?.repeatPassword ? classes.invalid : undefined}
      />
      {formErrors?.repeatPassword && (
        <section className={classes.warrning}>Passwords must match.</section>
      )}

      <label className={classes.personal_info}>
        <input
          type="checkbox"
          {...register('checkbox', {
            required: true,
          })}
        />
        I agree to the processing of my personal information
      </label>

      <input type="submit" value="Create" disabled={!isValid} />

      <section>
        Already have an account? <Link to="/sign-in">Sign In.</Link>
      </section>
    </form>
  );
}

export default SignUp;
