import React, { useState } from 'react';
import { Box, CheckBox, Select } from 'grommet';
import Experience from './Experience';
import Logout from './Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { setLanguage } from '../features/data/stateslice';

const TopBar = ({ labeling, setLabeling }) => {
  const loggedIn = useSelector((state) => state.state.value).loggedIn;
  const lang = useSelector((state) => state.state.value).language;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const changeLanguage = (option) => {
    dispatch(setLanguage(option));
    i18n.changeLanguage(option);
  };

  return (
    <Box>
      <Box direction="row" justify="end">
        <Select
          value={lang}
          options={['en', 'fi']}
          onChange={({ option }) => changeLanguage(option)}
        ></Select>
        {loggedIn && <Logout></Logout>}
      </Box>
      <Box elevation="small" pad="medium" direction="row" justify="between">
        <CheckBox
          label={t('doLabel')}
          checked={labeling}
          onChange={() => setLabeling(!labeling)}
          toggle={true}
        />
        <Experience />
      </Box>
    </Box>
  );
};

const NarrowSelection = styled(Selection)`
  width: 100px;
`;

export default TopBar;
