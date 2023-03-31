import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Loader from '../Loader/Loader';
import { updateUserData, clearAuthorizationErrors } from '../../store';
import { SIGNIN } from '../../routing_paths';
import Form, { Email, ImgUrl, Password, Submit, Username } from '../Form/Form';

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
    setNameError(!!serverErrors?.username);
    setEmailError(!!serverErrors?.email);
  }, [serverErrors]);

  const { handleSubmit, reset, control } = useForm({
    mode: 'onBlur',
  });

  if (isLoading) return <Loader />;
  if (!isAuthorize) return <Redirect to={SIGNIN} />;

  const onSubmit = (data) => {
    const user = {};
    /* В форме могут оСтаваться пустые поля, но их
    нужно отфильтровывать перед отправкой, иначе 
    ошибка 422 <field> "can't be blank" */
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
    <Form title="Edit Profile" onSubmit={handleSubmit(onSubmit)}>
      <Username
        control={control}
        serverError={nameError}
        onChange={() => setNameError(false)}
        required={false}
      />

      <Email
        control={control}
        serverError={emailError}
        onChange={() => setEmailError(false)}
        required={false}
      />

      <Password
        control={control}
        label="New password"
        warrning="
          Your password needs to be at least 6 and not longer then 40
          characters."
        required={false}
      />

      <ImgUrl control={control} required={false} />

      <Submit control={control} value="Save" />
    </Form>
  );
}

export default EditProfile;
