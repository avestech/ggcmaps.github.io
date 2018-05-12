module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      files: ['lib/client-js/*.js'],
      options: {
        esnext: true,
        globals: {
          jQuery: true
        } // globals
      } // options
    }, // jshint
    uglify: {
      options: {
        beautify: false, // Makes code readable so that the debugger can be used
        mangle: {
          reserved: [
            '$timeout',
            '$eval'
          ]
        } // mangle
      }, // options
      my_target: {
        files: {
          'js/script.min.js': ['lib/client-js/*.js']
        } // files
      } // my_target
    }, // uglify
    compass: {
      dev: {
        options: {
          config: 'config.rb'
        } // options
      } // dev
    }, // compass
    'http-server': {
      'dev': {
        root: './',
        port: 3000,
        host: '0.0.0.0',
        cache: 0,
        showDir: false,
        autoIndex: true,
        ext: 'html',
        runInBackground: true,
        https: false,
        openBrowser: false
      }
    }, // http-server
    watch: {
      scripts: {
        files: ['lib/client-js/*.js'],
        tasks: ['uglify', 'jshint']
      }, // scripts
      sass: {
        files: ['lib/sass/*.scss'],
        tasks: ['compass:dev']
      }, // sass
      html: {
        files: ['/*.html']
      } // html
    } // watch
  }); // initConfig

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-http-server');

  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('css', ['compass:dev']);
  grunt.registerTask('server', ['http-server:dev']);
  grunt.registerTask('dev', ['http-server:dev', 'watch']);
  grunt.registerTask('default', ['watch']);
};
