/**
 * Created by Joao Carvalho on 31-03-2015.
 */
module.exports = function( grunt ) {
  var semver = require('semver'),
    child_process = require('child_process'),
    format = require('util').format,
    readlineSync = require('readline-sync');

  require('load-grunt-tasks')(grunt);

  //need this to get version... dont work in grunt-sed with <%= pkg.version %>!!! did not understand why!
  var pk = grunt.file.readJSON('package.json'),
    gitVersion;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildDir: 'dist',
    banner: [
      '/*!',
      ' * <%= pkg.name %> v%%VERSION%%',
      ' * <%= pkg.homepage %>',
      ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>; Licensed MIT',
      ' */\n\n'
    ].join('\n'),
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= buildDir %>/*'
            ]
          }
        ]
      }
    },
    sed: {
      version: {
        pattern: '%%VERSION%%',
        replacement: function() {
          return grunt.option('tag') || pk.version;
        },
        recursive: true,
        path: '<%= buildDir %>'
      }
    },
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            src: '<%= buildDir %>/<%= pkg.name %>.js'
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
        dest: '<%= buildDir %>/<%= pkg.name %>.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
        multistr: true,
        '-W030': true
      },
      build: ['Grunfile.js', 'src/**/*.js', 'tests/**/*_spec.js']
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        footer: '\n'
      },
      build: {
        options: {
          mangle: true,
          beautify: false,
          compress: true,
          indent_level: 0
        },
        files: {
          '<%= buildDir %>/<%= pkg.name %>.min.js': ['<%= buildDir %>/<%= pkg.name %>.js']
        }
      }
    },
    step: {
      options: {
        option: false
      }
    },
    exec: {
      karma: './node_modules/karma/bin/karma start'
    },
    /**
     * Test runner
     */
    karma: {
      /*mochasingle: {
          configFile: 'karma.mocha.conf.js',
          singleRun: true
      },*/
      jasminesingle: {
        configFile: 'karma.jasmine.conf.js',
        singleRun: true
      },
      /*mocha: {
          configFile: 'karma.mocha.conf.js',
          singleRun: false
      },*/
      jasmine: {
        configFile: 'karma.jasmine.conf.js',
        singleRun: false
      }


    },
    /**
     * e2e tests with protractor
     */
    protractor_webdriver: {
      update: {
        options: {
          path: './node_modules/.bin/',
          command: 'webdriver-manager update --standalone'
        }
      },
      continuous: {
        options: {
          keepAlive: true,
          path: './node_modules/.bin/',
          command: 'webdriver-manager start --seleniumPort 4444'
        }
      },
      single: {
        options: {
          keepAlive: false,
          path: './node_modules/.bin/',
          command: 'webdriver-manager start --seleniumPort 4444'
        }
      }
    },
    protractor: {
      options: {
        configFile: "tests/e2e/local/protractor.js",
        noColor: false,
        debug: false,
        args: { }
      },
      single: {
        options: {
          keepAlive: false
        }
      },
      continuous: {
        options: {
          keepAlive: true
        }
      }
    },
    /**
     * Local Web server
     */
    connect: {
      options: {
        port: 8888,
        hostname: 'localhost'
      },
      e2etest: {
        /*options: {
            // set the location of the application files
            base: ['app']
        }*/
      }
    },
    ngdocs: {
      all: [ 'src/**/*.js' ]
    },
    watch: {
      options: {
        livereload: true
      },
      //            karma: {
      //                files: ['app/js/**/*.js', 'test/unit/*.js'],
      //                tasks: ['karma:continuous:run']
      //            },
      protractor: {
        files: ['tests/e2e/*.html', 'src/**/*.js', 'tests/e2e/*_spec.js'],
        tasks: ['protractor:continuous']
      }
    },
    releasebuild: {
      default: {},
      minor: {
        options: {
          type: 'minor'
        }
      }
    }
  });

  /**
   * Test tasks
   */
  grunt.registerTask('test', ['jshint', /*'karma:mochasingle',*/ 'karma:jasminesingle']);
  grunt.registerTask('test:e2e', ['jshint', 'connect:e2etest', 'protractor_webdriver:continuous', 'protractor:continuous', 'watch:protractor']);
  grunt.registerTask('test:e2e:single', ['jshint', 'connect:e2etest', 'protractor_webdriver:single', 'protractor:single']);
  //grunt.registerTask('test:mocha', ['jshint', 'karma:mocha']);
  grunt.registerTask('test:jasmine', ['jshint', 'karma:jasmine']);
  /**
   * Build Task
   */
  grunt.registerTask('build', ['test', 'concat', 'ngAnnotate', 'uglify', 'sed:version']);
  /**
   * Release
   */
  grunt.registerTask('release', ['releasebuild:default']);
  /**
   * Default
   */
  grunt.registerTask('default', ['build']);
};
