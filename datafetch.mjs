import { auth, getDocs, getHealth, labels, me, projects, users } from './api.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testusers = [{username: 'admin', pass: 'pass'}, {username: 'user', pass:'useruser'}]
const currentUser = 0;

const api_added_user = 'test'

const sequence = async(testuser) => {
    /* check connection */
    const health = await getHealth();
    console.log('health', health);
    /* fetch token by using login information */
    const token = await auth(testuser.username, testuser.pass);
    console.log('tkn',token);
    /* fetch current user info and all users */
    await me(token);
    const users_resp = await users(token);
    console.log('users', users_resp);
    const interesting_user = users_resp.find(u => u.username === api_added_user);
    console.log('interesting_user', interesting_user);
    
    /* fetch all projects the user has access to */
    const _projects = await projects(token);
    console.log('projects', _projects);
    const textProject = _projects.results.find(p => p.project_type === 'DocumentClassification');
    console.log('textProject', textProject);

    const _project0labels = await labels(textProject.id, token);
    console.log('labels', _project0labels);

    const docs = await getDocs(textProject.id, token, 20);
    console.log('docs', docs);
}

sequence(testusers[currentUser]);