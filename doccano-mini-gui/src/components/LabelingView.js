import { Box } from 'grommet';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Sentence from './Sentence';

const LabelingView = ({
  currentSentence,
  labels,
  projectId,
  nextSentence,
  previousSentence,
  commandsPos,
  colorAlpha,
}) => {
  const data = useSelector((state) => state.data.value);
  const current = useSelector((state) => state.state.value).currentMessage;

  let currentData;
  if (data && data.length > 0) {
    currentData = data[current];
  }
  useEffect(() => {
    // check if we should skip current sentence
    if (
      currentData[currentSentence] &&
      currentData[currentSentence].greetings === '1'
    ) {
      if (
        currentSentence < data.length - 1 &&
        currentData[currentSentence + 1] &&
        currentData[currentSentence + 1].greetings !== '1'
      ) {
        nextSentence();
      } else {
        previousSentence();
      }
    }
  }, [
    data.length,
    currentData,
    currentSentence,
    nextSentence,
    previousSentence,
  ]);

  console.log('labelingview rerender');
  if (currentData) {
    return (
      <Box
        direction={commandsPos === 'bottom' ? 'column' : 'row'}
        fill="horizontal"
        justify="between"
      >
        <MessageContainer>
          {currentData.map((value, idx) => {
            return (
              <Sentence
                project_labels={labels}
                disabled={value.greetings === '1'}
                bold={idx === currentSentence}
                projectId={projectId}
                sentence={value}
                idx={idx}
                key={'sentence' + idx}
                colorAlpha={colorAlpha}
              />
            );
          })}
        </MessageContainer>
      </Box>
    );
  } else {
    return null;
  }
};

const MessageContainer = styled(Box)`
  text-align: left;
  display: block;
`;

export default LabelingView;
