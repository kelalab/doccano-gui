import { addRolemapping, adminAuth, auth, exportData, fileUpload, getDocs, getHealth, labels, me, newLabel, newUser, projects, roles, upload, users } from './api.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testusers = [{username: 'admin', pass: 'pass'}, {username: 'user', pass:'useruser'}]
const currentUser = 0;

const api_added_user = 'test'

const _labels = [
    {
        text: 'positiivinen',
        prefix_key: null,   // combination with suffix
        suffix_key: 1,      // what key to use in doccano gui to set this label, could also be used in custom ui
        background_color: '#0B9128',
        text_color: '#ffffff'
    },
    {
        text: 'negatiivinen',
        prefix_key: null,   // combination with suffix
        suffix_key: 2,      // what key to use in doccano gui to set this label, could also be used in custom ui
        background_color: '#FF0000',
        text_color: '#ffffff'
    },
    {
        text: 'neutraali',
        prefix_key: null,   // combination with suffix
        suffix_key: 3,      // what key to use in doccano gui to set this label, could also be used in custom ui
        background_color: '#000000',
        text_color: '#ffffff'
    }
]

const sequence = async(testuser) => {

    const token = await auth(testuser.username, testuser.pass);
    console.log('tkn',token);

    const _projects = await projects(token);
    console.log(_projects);
    const textProject = _projects.find(p => p.project_type === 'DocumentClassification');
    //const _project0labels = await labels(textProject.id, token);
    //console.log('labels', _project0labels);
    for(const label of _labels){
        const newLabelResp = await newLabel(JSON.stringify(label), textProject.id, token);
    };
}

sequence(testusers[currentUser]);