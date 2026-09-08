/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const envFilePath = path.resolve(__dirname, '.env');

const ensureEnvFileExists = () => {
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, `  
# Hub info
ORGAN_NAME=""
SPINAL_USER_ID=''
SPINALHUB_IP=''
SPINAL_PASSWORD=''
SPINALHUB_PORT=''

# Auth info
TOKEN_SECRET=""
AUTH_ADMIN_PASSWORD=""
TOKEN_BOS_ADMIN=""
REGISTER_KEY=""

# Server info
REQUESTS_PORT=''
LIMIT_LOG="3000"
SERVER_PROTOCOL="http" # https / http
SSL_CERT_PATH=""
SSL_KEY_PATH=""
NODE_TLS_REJECT_UNAUTHORIZED=0
      `);
  }
};

// read .env file & convert to array
const readEnvVars = () => {
  ensureEnvFileExists();
  const content = fs.readFileSync(envFilePath, 'utf-8');
  return content ? content.split(os.EOL) : [];
};

function getEnvValue(key) {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars().find((line) => line.split('=')[0] === key);
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split('=')[1] : null;
}

function setEnvValue(key, value) {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split('=')[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
  } else {
    // create new key value
    envVars.push(`${key}="${value}"`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
}

// examples
// setEnvValue('KEY_1', 'value 1');
module.exports = { getEnvValue, setEnvValue };
