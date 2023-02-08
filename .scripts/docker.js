'use strict';

const spawn = require('child_process').spawn;
var port = process.env.npm_package_config_port || 3000,
    cwd = process.cwd().replace(':','').split('\\'),
    mount = process.env.npm_package_config_mount || '/mnt/dev/project',
    image = process.env.npm_package_config_docker_image || 'mdeiters/minimalistweb',
    version = process.env.npm_package_config_image_version || 'latest';

var currentDir = '/';

for (var i = 0; i < cwd.length; i++) {
  if (i === 0) {
    currentDir += cwd[i].toLowerCase() + '/';
  }
  else {
    currentDir += cwd[i] + '/';
  }
}

const cmd = ['run', '-p', port + ':' + port, '-v', currentDir + ':' + mount, image + ':' + version];

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
