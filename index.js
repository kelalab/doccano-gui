import { addRolemapping, adminAuth, auth, exportData, fileUpload, getDocs, getHealth, labels, me, newLabel, newUser, projects, roles, upload, users } from './api.js';
import {readFileSync} from 'fs';
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
    /* authenticate to admin api */
    const admin_cookies = await adminAuth(testuser.username, testuser.pass);
    console.log('admin_cookies', admin_cookies);
    const new_user = await newUser(api_added_user,'salakala', null, admin_cookies);
    console.log('new_user', new_user);
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
    console.log(_projects);
    const textProject = _projects.find(p => p.project_type === 'DocumentClassification');
    const _roles = await roles(token);
    console.log('roles', _roles);
    // get docs in projects
    const docs = await getDocs(textProject.id, token);
    const annotator_role = _roles.find(role => role.name === 'annotator');
    addRolemapping(interesting_user.id, interesting_user.username, textProject.id, annotator_role.id, annotator_role.rolename, token);
    const _project0labels = await labels(textProject.id, token);
    console.log('labels', _project0labels);
    const _newLabel = {
        text: 'apinkauttaLisatty',
        prefix_key: null,   // combination with suffix
        suffix_key: 3,      // what key to use in doccano gui to set this label, could also be used in custom ui
        background_color: '#000000',
        text_color: '#ffffff' 
    }
    const newLabelResp = await newLabel(JSON.stringify(_newLabel), textProject.id, token);
    await exportData(textProject.id, 'JSON', false, token);
    /* First we upload the file that is later used for the dataset import */ 
    const fileId = await fileUpload(readFileSync(path.join(__dirname,'upload.json')), token)
    const format = 'JSON';
    const column_data = 'text';
    const column_label = 'label';
    /* Here we import the dataset and tell the format of the data  */
    const taskId = await upload(textProject.id, fileId, format, column_data, column_label, token);
    console.log('upload task: ', taskId);
    const imageProject = _projects.find(p => p.project_type === 'ImageClassification');
    // non-admin user currently has no image project
    if(imageProject){
        const fileId2 = await fileUpload(readFileSync('doge.jpg'), token);
        const taskId2 = await upload(imageProject.id, fileId2, 'ImageFile', null, null, token);
    }

}

sequence(testusers[currentUser]);