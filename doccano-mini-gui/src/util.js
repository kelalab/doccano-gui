export const addDoc = async (projectId, currentItem) => {
  const res = await fetch(`/api/projects/${projectId}/docs`, {
    method: 'POST',
    body: JSON.stringify({
      text: currentItem.S,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });
  return res.json();
};

export const findDoc = async (projectId, search) => {
  const res = await fetch(`/api/projects/${projectId}/docs?search=${search}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
  return res.json();
};

export const getAnnotations = async (projectId, docId) => {
  const annotations_response = await fetch(
    `/api/projects/${projectId}/docs/${docId}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
  return annotations_response.json();
};

/**
 *
 * @param {*} projectId
 * @param {*} itemId
 * @param {*} label
 * @returns
 */
export const add_label = async (projectId, itemId, label) => {
  let res = await fetch(`/api/projects/${projectId}/docs/${itemId}`, {
    method: 'POST',
    body: JSON.stringify({
      labelId: label.id,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });
  return res.json();
};

/**
 *
 * @param {*} projectId
 * @param {*} itemId
 * @param {*} label_id
 * @returns
 */
export const delete_label = async (projectId, itemId, label_id) => {
  await fetch(
    `/api/projects/${projectId}/docs/${itemId}/annotations/${label_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
  return;
};

export const get_user = async (userId) => {
  let res = await fetch(`/api/me/${userId}`);
  return res.json();
};

export const get_progress = async (projectId, userId) => {
  let res = await fetch(`/api/projects/${projectId}/progress`);
  return res.json();
};

export const update_states = async (projectId, docId) => {
  let res = await fetch(`/api/projects/${projectId}/examples/${docId}/states`, {
    method: 'POST',
    body: '{}',
  });
  return res.json();
};

export const get_doc = async (projectId, docId) => {
  let res = await fetch(`/api/projects/${projectId}/examples/${docId}`, {
    method: 'GET',
  });
  return res.json();
};

export const deduce_ready_state = async (
  sentence,
  projectId,
  dispatch,
  dispatchFn,
) => {
  console.log('deduce_ready_state', sentence);
  const { id } = sentence;
  if (id) {
    const doc = await get_doc(projectId, id);
    console.log('doc', doc);
    console.log('sentence to check for ready status', sentence);
    if (sentence.labels && sentence.labels.length > 0 && !doc.is_confirmed) {
      console.log('maybe set ready', sentence);
      let res = await update_states(projectId, id);
      if (res.confirmed_by) {
        console.log('adding exp');
        dispatch(dispatchFn);
      }
    } else if (
      !sentence.labels ||
      (sentence.labels.length === 0 && doc.is_confirmed)
    ) {
      console.log('should set not ready');
      await update_states(projectId, id);
      dispatch(dispatchFn);
    }
  }
};

export const login = async (credentials) => {
  let res = await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  console.log('loginres', res);
  return res.json();
};

export const logout = async () => {
  let res = await fetch(`/api/logout`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  console.log('logoutres', res);
  return res.json();
};

export const getProjects = async (projectId = null) => {
  let res = await fetch(`/api/projects${projectId ? `/${projectId}` : ''}`, {
    headers: {
      'Content-type': 'application/json',
    },
  });
  return res.json();
};

export const getLabels = async (projectId) => {
  const res = await fetch(`/api/projects/${projectId}/labels`);
  return res.json();
};

export const addToProject = async (projectId) => {
  const res = await fetch(`/api/projects/${projectId}/add`);
  return res.json();
};
