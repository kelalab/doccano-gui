import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  TextInput,
  Text,
} from 'grommet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setUserId } from '../features/data/stateslice';
import { get_user, login } from '../util';

const Login = () => {
  const [value, setValue] = React.useState({});
  const [loginerror, setLoginerror] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const log_in = async (credentials) => {
    setLoginerror(false);
    let res = await login(credentials);
    console.log('res', res);
    if (res.status === 'success') {
      dispatch(setLoggedIn(true));
      getMe();
    } else if (res.status === 'unauthorized') {
      setLoginerror(true);
    }
  };

  const getMe = async () => {
    let res = await get_user();
    console.log('me res', res);
    dispatch(setUserId(res.id));
  };

  return (
    <Box fill="horizontal">
      <Box
        align="center"
        elevation="medium"
        flex="shrink"
        margin={{ top: 'medium', horizontal: 'auto' }}
        pad="medium"
      >
        <Heading level={1} color="brand">
          {t('loginTitle')}
        </Heading>
        {loginerror && (
          <Box>
            <Text color="error">{t('loginFailed')}</Text>
          </Box>
        )}
        <Form
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          onSubmit={({ value }) => {
            console.log('form value', value);
            log_in(value);
          }}
        >
          <FormField label={t('username')}>
            <TextInput name="name"></TextInput>
          </FormField>
          <FormField label={t('password')}>
            <TextInput name="password" type={'password'}></TextInput>
          </FormField>
          <Button type="submit" primary label={t('login')}></Button>
        </Form>
      </Box>
    </Box>
  );
};

export default Login;
