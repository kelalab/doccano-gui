import { Text } from 'grommet';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { updateItem } from '../features/data/dataslice';
import { findDoc, getAnnotations } from '../util';

const Sentence = ({
  projectId,
  sentence,
  bold,
  project_labels,
  disabled,
  idx,
  colorAlpha,
}) => {
  //console.log('sentence', sentence);
  const { v_uid, id } = sentence;
  const dispatch = useDispatch();
  const labeling = useSelector((state) => state.state.value).labeling;

  useEffect(() => {
    const checkId = async (sentenceVuid) => {
      if (labeling) {
        const now = new Date().getTime();
        let updated = sentence.id_fetched ? sentence.id_fetched : 0;
        // if no id and last fetch try was over 120s/2min ago
        if (!sentence.id && now - updated > 120000) {
          //console.log('checkId', sentence);
          let getresponse = await findDoc(projectId, sentence.S);
          //console.log('getresponse', getresponse);
          if (getresponse.count > 0) {
            dispatch(
              updateItem({ item: sentence, id: getresponse.results[0].id }),
            );
          } else {
            dispatch(
              updateItem({ item: sentence, id_fetched: new Date().getTime() }),
            );
          }
        }
      }
    };
    checkId(v_uid);
  }, [v_uid, projectId, dispatch, labeling]);

  useEffect(() => {
    const fetchAnnotations = async () => {
      if (labeling && !sentence.labels && id) {
        try {
          let labels_res = await getAnnotations(projectId, id);
          console.log('annotations', labels_res);
          let labels = labels_res.reduce(
            (prev, current) => [...prev, current.label],
            [],
          );
          dispatch(updateItem({ item: sentence, labels: labels }));
          //console.log('simple annotations', labels);
        } catch (error) {
          console.warn('error during fetching sentence labels');
        }
      }
    };
    fetchAnnotations(id);
  }, [id, projectId, dispatch, labeling]);

  let colors = [];

  if (sentence) {
    if (sentence.labels) {
      sentence.labels.forEach((element) => {
        const label = project_labels.find((l) => l.id === element);
        if (label) {
          const matching_color = label.background_color;
          colors.push(matching_color + colorAlpha);
        }
      });
    }
    return (
      <SentenceWrapper colors={colors} labeling={labeling}>
        <Text
          style={{ background: 'transparent', borderRadius: '99px' }}
          weight={bold ? 'bold' : 'normal'}
          color={disabled || !bold ? 'gray' : null}
        >
          {sentence.greetings === '1' && idx !== 0 && <br />}
          {sentence.S}
          {sentence.greetings === '1' && <br />}
        </Text>
      </SentenceWrapper>
    );
  }
  return <div />;
};

const SentenceWrapper = styled.span`
  ${(props) => {
    let background;
    const count = props.colors.length;
    const labeling = props.labeling;
    const bold = props.bold;
    if (count === 1) {
      background = props.colors[0];
    } else if (count === 2) {
      background = `linear-gradient(45deg, ${props.colors[0]} 45%, ${props.colors[1]} 45%)`;
    } else if (count === 3) {
      background = `linear-gradient(45deg, ${props.colors[0]} 33%, transparent 33%), linear-gradient(45deg, transparent, ${props.colors[1]} 66%, ${props.colors[2]} 66%)`;
    }
    if (background && labeling)
      return css`
        border-radius: 99px;
        background: ${background};
      `;
  }}
  padding-bottom: 3px;
  transition: background-color 500ms ease-in-out;
  margin: 1px;
  line-height: 1.7;
`;

export default Sentence;
