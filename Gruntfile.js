/**
 * Created by Joao Carvalho on 31-03-2015.
 */
    //gruntfile.js
module.exports = function (grunt) {
    var semver = require('semver'),
        child_process = require('child_process'),
        format = require('util').format,
        readlineSync = require('readline-sync');

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
            build: ['Grunfile.js', 'src/**/*.js', 'tests/**/*.js']
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
        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            /**
             * Get remote repos on git and set grunt.option('remote');
             * If more than one user is able to choose which
             */
            remote: {
                command: function (ok) {
                    return (ok && 'gruntlistremotes=$(git remote);printf "$gruntlistremotes"') || '$(exit 1)';
                },
                options: {
                    stdout: false,
                    stderr: true,
                    stdin: false,
                    callback: function (error, stdout, stderr, cb) {
                        if (error !== null) {
                            grunt.log.write(stderr);
                            cb(false);
                        }
                        else {
                            var remotes = stdout.split('\n');
                            if (remotes.length===1) {
                                grunt.option('remote', remotes[0]);
                                cb();
                                return;
                            }
                            remotes.forEach(function(item,idx,alist) {
                                alist[idx] = [ '[', idx + 1, ']-', item].join('');
                            });

                            var resp = 0;
                            grunt.log.writeln(format('%s ', '\n\nThere are more than 1 remote associate with this repo, please choose the one to push into.\n\n' + remotes));
                            while (isNaN(resp) || resp===0 || resp>remotes.length) {
                                resp = readlineSync.question('\nYour choice?');
                                if (resp==='') { cb(false); return; }
                                resp = parseInt(resp);
                            }
                            grunt.option('remote',stdout.split('\n')[resp-1]);//using original array
                            cb();
                        }

                    }
                }
            },
            /**
             * Git Tag with value in grunt.option("tag")
             * (called from task release)
             */
            tag: {
                command: function (ok) {
                    return (ok && 'echo ok #git tag -a v<%= grunt.option("tag") %> -m \'Version <%= grunt.option("tag") %>\'') || '$(exit 1)';
                },
                options: {
                    stdout: false,
                    stderr: true,
                    stdin: false,
                    callback: function(error, stdout, stderr, cb) {
                        if (error !== null) {
                            grunt.log.write(stderr);
                            cb(false);
                        }
                        cb();
                    }
                }
            },
            /**
             * Git push to remote with tags
             * (called from task push)
             */
            push: {
                command: function (ok) {
                    return (ok && 'echo ok #git push <%= grunt.option("remote") %> master --tags') || '$(exit 1)';
                },
                options: {
                    stdout: false,
                    stderr: true,
                    stdin: false,
                    callback: function(error, stdout, stderr, cb) {
                        if (error !== null) {
                            grunt.log.write(stderr);
                            cb(false);
                        }
                        cb();
                    }
                }
            }
        },
        step: {
            options: {
                option: false
            }
        },
        exec: {
            test_git_on_master: '[[ $(git symbolic-ref --short -q HEAD) = master ]]',
            test_git_is_clean: '[[ -z "$(git status --porcelain)" ]]',
            git_add: 'git add .',
            git_commit: {
                cmd: function (m) {
                    return format('git commit -m "%s"', m);
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

    /**
     * Update version on manifests files
     */
    grunt.registerTask('updmanifests', 'Update manifests.', function () {
        var _ = grunt.util._,
            pkg = grunt.file.readJSON('package.json'),
            bower = grunt.file.readJSON('bower.json'),
            version = grunt.option('tag', gitVersion);
        bower = JSON.stringify(_.extend(bower, {
            name: pkg.name,
            version: version
        }), null, 2);
        pkg = JSON.stringify(_.extend(pkg, {
            version: version
        }), null, 2);
        grunt.file.write('package.json', pkg);
        grunt.file.write('bower.json', bower);
    });
    /**
     * Task release: Inspired here: http://kroltech.com/2014/04/use-grunt-to-push-a-git-tag/
     */
    grunt.registerTask('release:patch', ['release']);
    grunt.registerTask('release:minor', function () {
        grunt.option('tagType', 'minor');
        grunt.task.run(['release']);
    });
    grunt.registerTask('release:major', function () {
        grunt.option('tagType', 'major');
        grunt.task.run(['release']);
    });
    grunt.registerTask('release', function () {
        if (grunt.option('tagType') !== 'major' &&
            grunt.option('tagType') !== 'minor') {
            grunt.option('tagType', 'patch');
        }
        var resp = readlineSync.question(format('\nRelease [%s] (Y/n)?', grunt.option('tagType')));
        if (resp.toLowerCase() !== 'y') {
            return false;
        }
        var done = this.async();
        child_process.exec('git describe --tags --abbrev=0',
            function (err, stdout, stderr) {
                if (stderr) {
                    grunt.log.error(stderr);
                }
                else {
                    gitVersion = semver.inc(stdout.trim(), grunt.option('tagType'));
                    grunt.option('tag', gitVersion);
                    grunt.task.run([
                        'exec:test_git_on_master',
                        'exec:test_git_is_clean',
                        format('step:Release/Update to version %s?', gitVersion),
                        'clean:dist',
                        'updmanifests',
                        'build',
                        'exec:git_add',
                        format('exec:git_commit:%s', format('Release version %s', gitVersion)),
                        'shell:tag:true',
                        'shell:remote:true',
                        'push'
                    ]);
                }
                done();
            }
        );
    });
    grunt.registerTask('push', function () {
        this.requires('release');
        if (grunt.option("remote")) {
            grunt.task.run([
                format('step:Push changes to %s?', grunt.option("remote")),
                'shell:push:true'
            ]);
        }
        else {
            return false;
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['test']);
    grunt.registerTask('test', ['karma', 'jshint']);
    grunt.registerTask('build', ['karma', 'jshint', 'concat', 'ngAnnotate', 'uglify', 'sed:version']);

};
