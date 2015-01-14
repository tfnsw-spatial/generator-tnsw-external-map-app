// Generated on <%= (new Date).toISOString().split('T')[0] %>
'use strict';

// helper variables and functions borrowed from generator-ember
var LIVERELOAD_PORT = 35729;
var liveReloadSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

    //instead of loadNpmTasks, load all dev dependencies from the package.json
    require('load-grunt-tasks')(grunt);

	// to setup the grunt proxy
	var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;	
	
    grunt.initConfig({

        // read package file for properties
        pkg: grunt.file.readJSON('package.json'),

        // copy files from downloaded packages into directories
        copy: {
            underscore: {
                files: {
                    'app/js/lib/underscore.js': 'bower_components/underscore/underscore-min.js'					
                }
            },
			dev:{
				expand: true,
				cwd: 'app/',
				src: ['**', '!js/*.js'],
				dest: 'dist/'
			}
        },
        watch: {
            options: {
                spawn: false,
                event: ['changed'],
                livereload: true
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/js/*.js',
                    'app/css/*.css',
                    'app/index.html',
					'app/css/scss/*.scss'
                ],
				tasks: ['compass']
            }
        },
        connect: {
            options: {
                port: 3000,
                open: true,
                hostname: 'localhost' // set to 0.0.0.0 if want access from external
            },
			/*proxies:[{
				context: '/',
				host: 'ngisuat.transport.nsw.gov.au'
			}],*/
            livereload: {
                options: {					
                    middleware: function (connect, options) {
                        return [
							proxySnippet,
                            liveReloadSnippet,
                            mountFolder(connect, 'app')
                        ]
                    }
                }
            }
        },
		clean: ['dist','build', 'war'],
		uglify: {
			options:{
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: true
			},
			dev:{
				files: [{
					expand: true,
					src: '*.js',
					dest: 'dist/js',
					cwd: 'app/js'
				}]
			}
		},
		compass:{
			dev: {
				options:{
					sassDir: ['app/css/scss'],
					cssDir: ['app/css'],
					environment: 'development'
				}
			}
		},
		cssmin:{
			dev:{
				files:[{
					expand: true,
					cwd: 'app/css',					
					src: '*.css',
					dest: 'dist/css'
				}]
			}
		},
		zip:{
			'using-cwd': {
				cwd: 'dist/',
				src: ['dist/**'],
				dest: 'war/<%= pkg.name %>.war'
			}
		}
    });

    // set up aliases
    grunt.registerTask('serve', ['copy', 'compass', 'configureProxies', 'connect:livereload', 'watch']);
	
	
	grunt.registerTask('deploy', ['clean', 'compass:dev', 'copy:dev', 'uglify:dev', 'cssmin:dev', 'zip']);
	
	//grunt.registerTask('serve', function(target){
	//	grunt.task.run(['copy', 
	//});
	
};