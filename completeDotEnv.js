const generator = require('generate-password');
const dotenv = require('dotenv');
const { setEnvValue } = require('./whriteToenvFile');

dotenv.config();
generator.generate({ length: 10, numbers: true });

function checkOrGenerate() {
    const TOKEN_SECRET = process.env.TOKEN_SECRET || generator.generate({ length: 20, numbers: true });
    const AUTH_ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD || generator.generate({ length: 10, numbers: true });
    const REGISTER_KEY = process.env.REGISTER_KEY || generator.generate({ length: 15, numbers: true });

    setEnvValue("TOKEN_SECRET", TOKEN_SECRET);
    setEnvValue("AUTH_ADMIN_PASSWORD", AUTH_ADMIN_PASSWORD);
    setEnvValue("REGISTER_KEY", REGISTER_KEY);

}

checkOrGenerate();