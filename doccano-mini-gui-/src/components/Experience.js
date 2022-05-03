import { Box, Meter, Text } from 'grommet';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { setExp } from '../features/data/experienceslice';
import { get_progress, get_user } from '../util';

const Experience = () => {
  const userId = useSelector((state) => state.state.value).userId;
  const projectId = useSelector((state) => state.state.value).projectId;
  const dispatch = useDispatch();
  const exp = useSelector((state) => state.experience.value).exp;
  const expDirty = useSelector((state) => state.experience.value).isDirty;

  const initial_level_up = 2;

  const level = useMemo(() => {
    console.log('calling level');
    let lvl = 1;
    let required_exp = 0;
    if (exp > initial_level_up) {
      while (true) {
        required_exp += Math.pow(initial_level_up, lvl);
        console.log('lvl', lvl, 'next_lvl_up', required_exp);
        if (exp < required_exp) {
          break;
        }
        lvl++;
      }
    }
    return lvl;
  }, [exp]);

  const normalizedValue = useMemo(() => {
    let normalizedOutput = exp;
    if (level === 1) {
      return exp;
    } else {
      for (let i = 1; i <= level; i++) {
        let levelexp = Math.pow(initial_level_up, i);
        if (normalizedOutput >= levelexp) {
          normalizedOutput -= levelexp;
        }
      }
      return normalizedOutput;
    }
  }, [exp, level]);

  const normalizedMax = useMemo(() => {
    return Math.pow(initial_level_up, level);
  }, [level]);

  useEffect(() => {
    const getProgress = async () => {
      await get_user(projectId, userId);
      const progress = await get_progress(projectId, null);
      console.log(progress);
      dispatch(setExp(progress.done));
    };
    console.log('getProgress', projectId, userId);
    if (projectId && projectId !== -1 && userId !== -1) {
      getProgress();
    }
  }, [projectId, userId, dispatch, expDirty]);

  console.log('exp', exp);
  console.log(exp && exp > 0 && normalizedValue === 0);
  return (
    <Box>
      {exp && exp > 0 && normalizedValue === 0 ? (
        <AnimatedText>Taso: {level}</AnimatedText>
      ) : (
        <Text>Taso: {level}</Text>
      )}

      <Meter value={normalizedValue} max={normalizedMax} />
      <Text>
        {normalizedValue}/{normalizedMax}
      </Text>
    </Box>
  );
};

const lvlupAnimation = keyframes`
    0% {transform: rotate(0deg)}
    50% {transform: rotate(180deg); font-weight: bold; font-size: 2em}
    100% {transform: rotate(360deg)}
`;

const AnimatedText = styled(Text)`
  animation-name: ${lvlupAnimation};
  animation-duration: 3s;
`;

export default Experience;
