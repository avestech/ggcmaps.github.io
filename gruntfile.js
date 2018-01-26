module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ["lib/client-js/*.js"],
      options: {
        esnext: true,
        globals: {
          jQuery: true
        } // globals
      } // options
    }, // jshint
    uglify: {
      options: {
        beautify : true, //Makes code readable so that the debugger can be used
        mangle: {
          except: [
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
    watch: {
      options: { livereload: true },
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
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('css', ['compass:dev']);
  grunt.registerTask('default', ['watch']);
};
