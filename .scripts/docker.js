'use strict';

const spawn = require('child_process').spawn;
var port = process.env.npm_package_config_port || 3000,
    cwd = process.cwd(),
    mount = process.env.npm_package_config_mount || '/mnt/dev/project',
    image = process.env.npm_package_config_docker_image || 'mdeiters/minimalistweb',
    version = process.env.npm_package_config_image_version || 'latest';
const cmd = ['run', '-it', '-p', port + ':' + port, '-v', cwd + ':' + mount, image + ':' + version];

const p = spawn('docker', cmd, {
  shell: true,
  stdio: 'inherit'
});

p.on('data', (data) => {
  console.log(data.toString());
});

p.on('error', function(err) {
  console.log(err);
});
