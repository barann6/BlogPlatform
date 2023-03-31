import { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Form, { Email, Password, Submit } from '../Form/Form';
import Loader from '../Loader/Loader';
import { signIn, clearAuthorizationErrors } from '../../store';
import { SIGNUP } from '../../routing_paths';

function SignIn() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(clearAuthorizationErrors());
  }, []);

  const { handleSubmit, control } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
    /* defaultValues можно указать через useControl в их персональных компонентах, но
    перестает корректно работать свойство isDirty (TRUE на пустых полях почему-то, 
    но если установить их так, то все норм). По этому я задаю defaultValues здесь, и для 
    SignUP и EditProfile пришлось так же.*/
  });

  const error = useSelector((state) => state.authorization.errors);
  const isLoading = useSelector((state) => state.authorization.loading);
  const isAuthorize = useSelector((state) => state.authorization.userName);

  if (isLoading) return <Loader />;
  if (isAuthorize) return <Redirect to="/" />;

  const onSubmit = ({ email, password }) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <Form
      title="Sign in"
      footer={['Don’t have an account? ', <Link to={SIGNUP}>Sign Up.</Link>]}
      onSubmit={handleSubmit(onSubmit)}>
      <Email control={control} />

      <Password
        control={control}
        warrning="Password required."
        rules={{ required: true }}
      />

      <Submit control={control} value="Login" error={error} />
    </Form>
  );
}

export default SignIn;
