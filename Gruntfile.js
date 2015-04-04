/**
 * Created by Joao Carvalho on 31-03-2015.
 */
//gruntfile.js
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            src: 'src/angular-remote-typeaheadjs.js'
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
        multistr: true,
        '-W030': true
      },
      build: ['Grunfile.js', 'src/**/*.js', 'tests/**/*.js']
    },
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/<%= pkg.name %>.min.js':  ['src/**/*.js']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', ['karma', 'jshint', 'concat', 'ngAnnotate', 'uglify']);

};
