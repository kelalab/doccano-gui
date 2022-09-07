import { Box, Grommet, Keyboard, grommet } from 'grommet';
import { useEffect, useState } from 'react';
import './App.css';
import LabelingView from './components/LabelingView';
import {
  addDoc,
  add_label,
  deduce_ready_state,
  delete_label,
  getAnnotations,
  getProjects,
} from './util';
import { useDispatch, useSelector } from 'react-redux';
import { appendData, updateItem } from './features/data/dataslice';
import Commands from './components/Commands';
import TopBar from './components/TopBar';
import {
  setGuideLine,
  setLabeling,
  setLanguage,
  updateCurrent,
} from './features/data/stateslice';
import styled, { css } from 'styled-components';
import { FormNextLink } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { setIsDirty } from './features/data/experienceslice';
import Login from './components/Login';
import SelectProject from './components/SelectProject';
import { useTranslation } from 'react-i18next';

function App() {
  // # of current message to label
  //const [current, setCurrent] = useState(0);
  // # of current sentence in the message being labeled
  const [currentSentence, setCurrentSentence] = useState(0);
  const [nextpageurl, setNextpageurl] = useState('');
  const [labels, setLabels] = useState([]);
  const [count, setCount] = useState(0);
  const projectId = useSelector((state) => state.state.value).projectId;
  const current = useSelector((state) => state.state.value).currentMessage;
  const labeling = useSelector((state) => state.state.value).labeling;
  const data = useSelector((state) => state.data.value);
  const loggedIn = useSelector((state) => state.state.value).loggedIn;
  const guideLine = useSelector((state) => state.state.value).guideLine;
  const language = useSelector((state) => state.state.value).language;
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const _setLabeling = (value) => dispatch(setLabeling(value));

  const [commandsPos, setCommandsPos] = useState('bottom');
  const colorAlpha = 99;

  const theme = deepMerge(grommet, {
    global: {
      colors: {
        error: 'darkred',
      },
    },
  });

  const loadData = async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    dispatch(appendData(json.results));
    setNextpageurl(json.next);
    console.log('nextpage', json);
  };

  const next = async () => {
    console.log('nextaction', 'current', current);
    if (current === data.length - 1 && nextpageurl) {
      console.log('we need to load next page of results');
      await loadData(nextpageurl);
      //await setCurrent(current + 1);
      dispatch(updateCurrent(current + 1));
      setCurrentSentence(0);
    }
    if (current < data.length - 1) {
      //setCurrent(current + 1);
      dispatch(updateCurrent(current + 1));
      setCurrentSentence(0);
    }
  };

  let currentData = null;

  useEffect(() => {
    console.log('language', i18n.language);
    dispatch(setLanguage(i18n.language));
  }, [i18n.language]);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`/api/message`);
      //const res = await fetch(`/api/projects/${projectId}/docs`);
      const json = await res.json();
      console.log('res json', json);
      setNextpageurl(json.next);
      dispatch(appendData(json.results));
      setCount(json.count);
    };
    if (!data || data.length === 0) {
      getData();
    }
  }, [data, dispatch]);

  useEffect(() => {
    const getLabels = async () => {
      const res = await fetch('/api/projects/1/labels');
      const json = await res.json();
      console.log('res json', json);
      //if (labels.length !== json.length) {
      setLabels(json);
      // }
    };
    if (loggedIn) {
      getLabels();
    }
  }, [loggedIn]);

  useEffect(() => {
    const getProjectData = async () => {
      let projectData = await getProjects(projectId);
      console.log('getProjectData', projectData);
      const guideLine = projectData.guideline;
      const gdl = guideLine.split('\n');
      let parsed_guideline = {};
      let current_section;
      let current_key;
      gdl.forEach((line) => {
        if (line.trim().startsWith('## ')) {
          let section = line.trim().replace('## ', '');
          console.log('section', section);
          parsed_guideline[section] = {};
          current_section = section;
        } else if (line.trim().startsWith('### ')) {
          let key = line.trim().replace('### ', '');
          parsed_guideline[current_section][key] = '';
          current_key = key;
        } else {
          if (current_section && current_key) {
            parsed_guideline[current_section][current_key] = line;
          }
        }
      });
      console.log('guideLine', gdl);
      console.log('parse_guideline', parsed_guideline);
      dispatch(setGuideLine(parsed_guideline));
    };
    if (projectId !== -1) {
      getProjectData();
    }
  }, [projectId, dispatch]);

  const prev = () => {
    console.log('prevaction');
    if (current >= 1) {
      //setCurrent(current - 1);
      dispatch(updateCurrent(current - 1));

      setCurrentSentence(0);
    }
  };

  const nextSentence = () => {
    console.log(currentSentence, currentData);
    if (currentSentence < currentData.length - 1) {
      setCurrentSentence(currentSentence + 1);
    }
  };

  const previousSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
    }
  };

  const isLastSentence = (data, sentenceIdx) => {
    if (sentenceIdx >= data.length - 1) {
      return true;
    } else if (data[sentenceIdx + 1].greetings === '1') {
      return true;
    }
    return false;
  };

  const keyHandler = async (event) => {
    const key = event.key;
    const label = labels.find((l) => l.suffix_key === key + '');
    if (label) {
      handleSelect(label);
    }
  };

  const handleSelect = async (label) => {
    let currentItem = data[current][currentSentence];
    let currentLabels = currentItem.labels || [];
    let shouldRemove = false;
    let labelToRemove;
    if (currentLabels.length > 0) {
      currentLabels.forEach((cl) => {
        if (cl === label.id) {
          shouldRemove = true;
          labelToRemove = cl;
        }
      });
    }
    if (shouldRemove) {
      console.log('removing', labelToRemove);
      const currentLabels = await getAnnotations(projectId, currentItem.id);
      console.log('label response pre delete', currentLabels);
      const label_id = currentLabels.find(
        (cl) => cl.label === labelToRemove,
      ).id;
      await delete_label(projectId, currentItem.id, label_id);
      const annotations_json = await getAnnotations(projectId, currentItem.id);
      if (annotations_json.length === 0) {
        console.log('0 labels', currentItem);
      }
      let _labels = annotations_json.reduce(
        (prev, current) => [...prev, current.label],
        [],
      );
      deduce_ready_state(
        { ...currentItem, labels: _labels },
        projectId,
        dispatch,
        setIsDirty(true),
      );
      dispatch(updateItem({ item: currentItem, labels: _labels }));
      return;
    }
    let annotations_json;
    if (!currentItem.id) {
      let addresponse = await addDoc(projectId, currentItem);
      console.log('addresponse', addresponse);
      dispatch(updateItem({ item: currentItem, id: addresponse.id }));
      annotations_json = await add_label(projectId, addresponse.id, label);
      let _labels;
      if (Array.isArray(annotations_json)) {
        _labels = annotations_json.reduce(
          (prev, current) => [...prev, current.label],
          [],
        );
      } else {
        console.log('not array');
        _labels = [annotations_json.label];
      }
      if (_labels) {
        deduce_ready_state(
          { ...currentItem, id: addresponse.id, labels: _labels },
          projectId,
          dispatch,
          setIsDirty(true),
        );
        dispatch(updateItem({ item: currentItem, labels: _labels }));
      }
    } else {
      await add_label(projectId, currentItem.id, label);
      annotations_json = await getAnnotations(projectId, currentItem.id);
      let _labels = annotations_json.reduce(
        (prev, current) => [...prev, current.label],
        [],
      );
      deduce_ready_state(
        { ...currentItem, labels: _labels },
        projectId,
        dispatch,
        setIsDirty(true),
      );
      dispatch(updateItem({ item: currentItem, labels: _labels }));
    }
  };
  if (data && data.length > 0) {
    currentData = data[current];

    return (
      <Grommet className="App" theme={theme}>
        {loggedIn ? (
          <>
            {projectId !== -1 ? (
              <Box>
                {labeling && (
                  <Keyboard
                    target="document"
                    onKeyDown={keyHandler}
                    onDown={nextSentence}
                    onUp={previousSentence}
                  >
                    <Box></Box>
                  </Keyboard>
                )}
                <Keyboard target="document" onRight={next} onLeft={prev}>
                  <Box></Box>
                </Keyboard>
                <Box>
                  <TopBar labeling={labeling} setLabeling={_setLabeling} />
                  <Box fill="horizontal" flex={'grow'} pad={'medium'}>
                    <Box flex={'grow'}>
                      <div>{`${current + 1}/${count}`}</div>
                    </Box>
                    <Box>
                      <LabelingView
                        nextSentence={nextSentence}
                        previousSentence={previousSentence}
                        projectId={projectId}
                        currentSentence={currentSentence}
                        labels={labels}
                        colorAlpha={colorAlpha}
                        commandsPos={commandsPos}
                      />
                    </Box>
                  </Box>
                  <Commands
                    position={commandsPos}
                    labels={labels}
                    onLabelClick={handleSelect}
                    currentSentence={currentSentence}
                    item={currentData}
                    labeling={labeling}
                    colorAlpha={colorAlpha}
                    guideLine={guideLine}
                    cmdRows={2}
                    commands={[
                      {
                        label: t('prevSentence'),
                        onClick: previousSentence,
                        disabled: !labeling,
                        icon: (
                          <TurnedBox rotate={-90}>
                            <FormNextLink color="black" />
                          </TurnedBox>
                        ),
                        row: 0,
                      },
                      {
                        label: t('prevMsg'),
                        onClick: prev,
                        icon: (
                          <TurnedBox rotate={-180}>
                            <FormNextLink color="black" />
                          </TurnedBox>
                        ),
                        row: 1,
                      },
                      {
                        label: t('nextSentence'),
                        onClick: nextSentence,
                        disabled: !labeling,
                        icon: (
                          <TurnedBox rotate={90}>
                            <FormNextLink color="black" />
                          </TurnedBox>
                        ),
                        row: 1,
                      },
                      {
                        label: t('nextMsg'),
                        onClick: next,
                        icon: (
                          <TurnedBox>
                            <FormNextLink color="black" />
                          </TurnedBox>
                        ),
                        row: 1,
                      },
                    ]}
                  />
                </Box>
              </Box>
            ) : (
              <SelectProject />
            )}
          </>
        ) : (
          <Login />
        )}
      </Grommet>
    );
  } else {
    return <div>Loading...</div>;
  }
}

const TurnedBox = styled(Box)`
  ${(props) =>
    props.rotate &&
    css`
      transform: rotate(${props.rotate}deg);
    `}
`;

export default App;
