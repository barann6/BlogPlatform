import { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './SignIn.module.scss';
import Loader from '../Loader/Loader';
import { signIn, clearAuthorizationErrors } from '../../store';

function SignIn() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(clearAuthorizationErrors());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isValid },
  } = useForm({ mode: 'onBlur' });

  const serverErrors = useSelector((state) => state.authorization.errors);
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);
  
  if (isLoading) return <Loader />;
  if (isAuthorize) return <Redirect to="/" />;

  const onSubmit = ({ email, password }) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign in</h2>

      <label>Email address</label>
      <input
        placeholder="Email address"
        {...register('email', {
          required: true,
          pattern: /\S+@\S+\.\S+/,
        })}
        className={formErrors?.email ? classes.invalid : undefined}
      />
      {formErrors?.email && (
        <section className={classes.warrning}>
          Entered value does not match email format.
        </section>
      )}

      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        {...register('password', {
          required: true,
        })}
        className={formErrors?.password ? classes.invalid : undefined}
      />
      {formErrors?.password && (
        <section className={classes.warrning}>Password required.</section>
      )}

      <input
        type="submit"
        value="Login"
        className={classes.submit}
        disabled={!isValid}
      />
      {serverErrors?.username && (
        <section className={classes.warrning}>
          Email or password is invalid.
        </section>
      )}

      <section>
        Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
      </section>
    </form>
  );
}

export default SignIn;
