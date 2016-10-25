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
        mangle: {
          except: [
            '$timeout',
            '$eval'
          ]
        } // mangle
      }, // options
      my_target: {
        files: {
          'public/js/script.min.js': ['lib/client-js/*.js']
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
        files: ['public/*.html']
      } // html
    }, // watch
	jasmine: {
		components: {
              src: [
              'lib/client-js/*js'
              ],
              options: {
                specs: 'tests/spec/*Spec.js',
                keepRunner : true,
                //helpers: 'test/spec/*.js'
              }
      
    },
  }); // initConfig
  
  grunt.registerTask('travis',['jasmine']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('css', ['compass:dev']);
  grunt.registerTask('default', ['watch']);
};
