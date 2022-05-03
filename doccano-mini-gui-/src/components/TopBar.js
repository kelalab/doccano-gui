import React from 'react';
import { Box, CheckBox } from 'grommet';
import Experience from './Experience';
import Logout from './Logout';
import { useSelector } from 'react-redux';

const TopBar = ({ labeling, setLabeling }) => {
  const loggedIn = useSelector((state) => state.state.value).loggedIn;

  return (
    <Box>
      {loggedIn && <Logout></Logout>}
      <Box elevation="small" pad="medium" direction="row" justify="between">
        <CheckBox
          label={'Luokittele'}
          checked={labeling}
          onChange={() => setLabeling(!labeling)}
          toggle={true}
        />
        <Experience />
      </Box>
    </Box>
  );
};

export default TopBar;
