import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import {
  addAnnotation,
  addRolemapping,
  adminAuth,
  auth,
  getAnnotations,
  getDoc,
  getDocs,
  labels,
  me,
  myProgress,
  newUser,
  postDoc,
  projects,
  removeAnnotation,
  roles,
  searchDoc,
  setReady,
} from './api.mjs';
import { log, LOG_LEVELS } from './logger.mjs';
import { readCSV, readZip } from './parse.mjs';
import morgan from 'morgan';

const app = express();
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
const server = createServer(app);
const port = 4000;
const logger = log({ level: LOG_LEVELS.DEBUG });
let unusedport = port;

//const data = readCSV();
const password = process.env.DATA_PWD || 'salasana';
const data = readZip(password);
let groupedData;

const allowedLogins = process.env.USERS;
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

app.use(express.json());

app.use(morgan(':method :url :response-time'));

app.use('/', async (req, res, next) => {
  const { token, credentials, admintoken } = req.session;
  if (!admintoken) {
    const _admintoken = await auth(adminUser, adminPass);
    req.session.admintoken = _admintoken;
  }
  if (!token && credentials) {
    let token;
    try {
      token = await auth(credentials.name, credentials.password);
      const _projects = await projects(token);
      console.log('projects', _projects);
      if (!token && credsMatchEnv(credentials)) {
        console.log('lets register if funky things with token');
        const admin_cookies = await adminAuth(adminUser, adminPass);
        console.log('admin_cookies', admin_cookies);
        const new_user = await newUser(
          credentials.name,
          credentials.password,
          null,
          admin_cookies,
        );
        console.log('new_user', new_user);
        token = await auth(credentials.name, credentials.password);
        //addRolemapping(interesting_user.id, interesting_user.username, 1, annotator_role.id, annotator_role.rolename, token);
      }
      req.session.token = token;
    } catch (err) {
      console.error('auth error', err);
    }
    if (!token) {
      res.status(403).send();
    }
  }
  next();
});

app.get('/api/projects/:projectId?', async (req, res) => {
  const admin_token = req.session.admintoken;
  const token = req.session.token;
  const projectId = req.params.projectId;
  if (projectId) {
    res.json(await projects(token, projectId));
  } else {
    res.json(await projects(admin_token));
  }
});

const arrToMap = (arr, key) =>
  arr.reduce((previousValue, currentValue) => {
    return previousValue.set(currentValue[key], [
      ...(previousValue.get(currentValue[key]) || []),
      currentValue,
    ]);
  }, new Map());

app.get('/api/me/:userId?', async (req, res) => {
  const userId = req.params.userId;
  const token = req.session.token;
  res.json(await me(token));
});

app.get('/api/projects/:projectId/progress/:userId?', async (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const token = req.session.token;
  res.json(await myProgress(projectId, token));
});

app.get('/api/projects/:projectId/examples/:docId', async (req, res) => {
  const docId = req.params.docId;
  const projectId = req.params.projectId;
  const token = req.session.token;
  res.json(await getDoc(projectId, docId, token));
});

app.post(
  '/api/projects/:projectId/examples/:docId/states',
  async (req, res) => {
    const docId = req.params.docId;
    const projectId = req.params.projectId;
    const token = req.session.token;
    res.json(await setReady(projectId, docId, token));
  },
);

app.use('/api/message', async (req, res, next) => {
  let _data = await data;
  let numLimit;
  let numOffset;
  groupedData = arrToMap(_data, 'v_uid');
  //console.log(groupedData);
  const query = req.query;
  logger.debug('query', query);
  let { limit, offset } = query;
  if (!limit) {
    numLimit = 10;
  } else {
    numLimit = Number.parseInt(limit);
  }
  if (!offset) {
    numOffset = 0;
  } else {
    numOffset = Number.parseInt(offset);
  }
  let arr = [];
  let keys = groupedData.keys();
  logger.debug(keys, numOffset);
  for (let i = 0; i < numOffset; i++) {
    let key = keys.next().value;
  }
  for (let i = numOffset; i < numOffset + numLimit; i++) {
    let key = keys.next().value;
    arr.push(groupedData.get(key));
  }
  res.json({
    results: arr,
    next: `/api/message?offset=${numOffset + numLimit}&limit=${numLimit}`,
    count: groupedData.size,
  });
});

app.use(
  '/api/projects/:id/docs/:docId/annotations/:labelId',
  async (req, res, next) => {
    const token = req.session.token;
    const id = req.params.id;
    const docId = req.params.docId;
    const labelId = req.params.labelId;
    console.log('params', req.params);
    if (req.method === 'DELETE') {
      console.log('removing annotation');
      const resp = await removeAnnotation(id, docId, labelId, token);
      console.log('deleteres', resp);
      if (resp.status === 204 && resp.statusText === 'No Content') {
        res.status(200).send();
      }
    }
    next();
  },
);

app.use('/api/projects/:id/docs/:docId?', async (req, res, next) => {
  const id = req.params.id;
  const docId = req.params.docId;
  const body = req.body;
  const query = req.query;
  const token = req.session.token;
  const admintoken = req.session.admintoken;
  logger.debug('body', body);
  logger.debug('params', req.params);
  logger.debug('query', query);
  if (docId) {
    console.log('docId', docId);
    if (req.method === 'POST') {
      console.log('should update annotation');
      const addResult = await addAnnotation(id, docId, req.body.labelId, token);
      res.json(addResult);
    }
    if (req.method === 'GET') {
      logger.debug('get doc annotations');
      const addResult = await getAnnotations(id, docId, token);
      res.json(addResult);
    }
  } else {
    if (req.method === 'POST') {
      console.log('some kinda post');
      const result = await postDoc(
        id,
        JSON.stringify({ meta: {}, text: body.text }),
        admintoken,
      );
      console.log('result', result);
      res.json(result);
      next();
    } else {
      const query = req.query;
      logger.debug('query', query);
      const { limit, offset, search } = query;
      let result;
      if (search) {
        logger.debug('searching');
        result = await searchDoc(id, token, search);
        logger.debug('search result', result);
        res.json(result);
        return;
      }
      result = await getDocs(id, token, limit, offset);
      console.log('docs result', result);
      if (result.next) {
        const v1pos_withoffset = result.next.indexOf('v1') + 2;
        result.next = '/api' + result.next.substring(v1pos_withoffset);
      }
      res.json(result);
      //res.json(JSON.stringify(result));
      next();
    }
  }
});

app.use(
  '/api/projects/:id/docs/:docId?/annotations?/labelId?',
  async (req, res, next) => {
    const id = req.params.id;
    const docId = req.params.docId;
    const body = req.body;
    const method = req.method;
    const token = req.session.token;

    console.log('method', method);
    console.log('body', body);
    console.log('params', req.params);
    if (docId) {
      console.log('docId', docId);
      if (req.method === 'POST') {
        console.log('should update annotation');
        addAnnotation(id, docId, req.body.labelId, token);
      } else if (req.method === 'DELETE') {
        console.log('removing annotation');
        const res = await removeAnnotation(id, docId, req.body.labelId, token);
        console.log(res);
      }
    } else {
      if (method === 'POST') {
        console.log('some kinda post');
      }
      const query = req.query;
      console.log('query', query);
      const { limit, offset } = query;
      const result = await getDocs(id, token, limit, offset);
      console.log('docs result', result);
      if (result.next) {
        const v1pos_withoffset = result.next.indexOf('v1') + 2;
        result.next = '/api' + result.next.substring(v1pos_withoffset);
      }
      res.json(result);
      //res.json(JSON.stringify(result));
      next();
    }
  },
);

app.use('/api/projects/:id/labels', async (req, res, next) => {
  const id = req.params.id;
  const query = req.query;
  const token = req.session.token;

  //console.log('query', query);
  const result = await labels(id, token);
  //console.log('labels result', result);
  res.json(result);
});

const credsMatchEnv = (credentials) => {
  const allowed_creds = [];
  allowed_creds.push({ name: adminUser, password: adminPass });
  allowedLogins.split(',').forEach((value) => {
    let kv = value.split('-');
    allowed_creds.push({ name: kv[0], password: kv[1] });
  });
  let match = allowed_creds.find((cred) => cred.name === credentials.name);
  if (match && match.password === credentials.password) {
    return true;
  }
  return false;
};

app.post('/api/login', async (req, res) => {
  const credentials = req.body;
  console.log('login call', req.body);
  console.log('allowed', allowedLogins);
  let match = credsMatchEnv(credentials);
  if (match) {
    req.session.credentials = credentials;
    res.status(200).json({ status: 'success' }).send();
  } else {
    res.status(403).json({ status: 'unauthorized' });
  }
});

app.post('/api/logout', async (req, res) => {
  req.session.destroy();
  res.status(200).json({ status: 'success' }).send();
});

app.get('/api/projects/:projectId/add', async (req, res) => {
  const { token, credentials } = req.session;
  const projectId = req.params.projectId;
  const _me = await me(token);
  const _roles = await roles(token);
  console.log('roles', _roles);
  const annotator_role = _roles.find((role) => role.name === 'annotator');
  const admin_token = await auth(adminUser, adminPass);
  let addRoleRes = await addRolemapping(
    _me.id,
    null,
    projectId,
    annotator_role.id,
    null,
    admin_token,
  );
  res.json(addRoleRes);
});

app.use(
  express.static('static', {
    setHeaders: (res, filePath) => {
      if (!filePath.endsWith('.html')) {
        // cache all resources but root html for a week
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      }
    },
  }),
);

server.listen(port, () => {
  console.log(`server listening on port ${port}.`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    unusedport = (Number.parseInt(unusedport) + 1).toString();
    setTimeout(() => {
      server.close();
      server.listen(unusedport, () => {
        console.log(`virta controller listening on port ${unusedport}.`);
      });
    }, 1000);
  }
});

process.on('SIGINT', () => {
  console.log('exiting');
  process.exit(0);
});
