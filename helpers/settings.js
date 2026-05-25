const { readJson, writeJson } = require('./json-db');
function getSettings(){ return readJson('settings.json', {}); }
function saveSettings(input){ const current=getSettings(); return writeJson('settings.json', { ...current, ...input }); }
module.exports={ getSettings, saveSettings };
