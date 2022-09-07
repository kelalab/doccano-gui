import { Box } from 'grommet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../features/data/stateslice';
import { logout } from '../util';
import SquareButton from './SquareButton';

const Logout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = async () => {
    let res = await logout();
    dispatch(setLoggedIn(false));
  };
  return (
    <Box>
      <SquareButton primary label={t('logout')} onClick={handleClick} />
    </Box>
  );
};

export default Logout;
