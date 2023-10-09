const fs = require('fs');
const { spawn } = require('child_process');

const filePath = './Build/index.js';

function checkFile() {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`${filePath} n'existe pas encore, veuillez patienter...`);
            setTimeout(checkFile, 1000);
        } else {
            console.log(`${filePath} existe, lancement de node --watch...`);

            const childProcess = spawn('node', ['--watch', './Build/index.js'], {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    NODE_ENV: 'development',
                }
            });

            childProcess.on('error', (error) => {
                console.error(`Erreur d'exécution de la commande de surveillance: ${error}`);
            });
        }
    });
}

checkFile();
