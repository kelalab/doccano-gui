import { Box, Heading, Select, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setProjectId } from '../features/data/stateslice';
import { addToProject, getLabels, getProjects, login, logout } from '../util';
import SquareButton from './SquareButton';

const SelectProject = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [value, setValue] = useState({});
  const [nonMember, setNonMember] = useState(false);
  const projectId = useSelector((state) => state.state.value).projectId;

  useEffect(() => {
    const fetchProjects = async () => {
      let res = await getProjects();
      console.log(res);
      let projects = res.results.reduce(
        (prev, current) => [...prev, { name: current.name, id: current.id }],
        [],
      );
      setProjects(projects);
      if (projects.length === 1) {
        setValue(projects[0]);
        let labels = await getLabels(projects[0].id);
        let projectData = await getProjects(projects[0].id);
        console.log('getProjectData', projectData);
        if (labels.detail) {
          setNonMember(true);
        } else {
          dispatch(setProjectId(projects[0].id));
        }
      }
    };
    fetchProjects();
  }, [dispatch]);

  const handleCancel = async () => {
    let res = await logout();
    dispatch(setLoggedIn(false));
  };

  const handleConfirm = async () => {
    let labels = await getLabels(value.id);
    let projectData = await getProjects(value.id);
    console.log('labels', labels);
    console.log('getProjectData', projectData);

    if (labels.detail) {
      setNonMember(true);
    } else {
      dispatch(setProjectId(value.id));
    }
  };

  const requestProject = async () => {
    let res = await addToProject(value.id);
    console.log('requestProject res', res);
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
          Valitse projekti
        </Heading>
        <Select
          value={value}
          onChange={({ option }) => setValue(option)}
          options={projects}
          labelKey="name"
        />
        <Box direction="row" gap="medium" pad="medium">
          <SquareButton primary label="Valitse" onClick={handleConfirm} />
          <SquareButton label="Peruuta" onClick={handleCancel} />
        </Box>
        {nonMember && (
          <Box margin="auto" align="center">
            <Text wordBreak="break-word">
              Vaikuttaa, että et ole vielä kyseisen projektin jäsen. Haluatko
              pyytää lisäystä?
            </Text>
            <Box direction="row" gap="medium" pad="medium">
              <SquareButton primary label="Kyllä" onClick={requestProject} />
              <SquareButton label="Ei" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SelectProject;
