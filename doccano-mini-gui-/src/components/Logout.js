import { Box } from 'grommet';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../features/data/stateslice';
import { logout } from '../util';
import SquareButton from './SquareButton';

const Logout = () => {
  const dispatch = useDispatch();
  const handleClick = async () => {
    let res = await logout();
    dispatch(setLoggedIn(false));
  };
  return (
    <Box margin={{ left: 'auto' }}>
      <SquareButton primary label="Kirjaudu ulos" onClick={handleClick} />
    </Box>
  );
};

export default Logout;
