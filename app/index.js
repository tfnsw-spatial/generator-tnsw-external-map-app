'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
		init: function () {
			this.pkg = require('../package.json');
		},

		promptUser : function () {
			var done = this.async();

			// Have Yeoman greet the user.
			this.log(yosay('Welcome to the tnsw-external-map-app generator!'));

			var prompts = [{
					type : 'input',
					name : 'appName',
					message : 'What will be the name of your app?',
					default: 'maptest'
				},
				{
					type : 'input',
					name : 'appTitle',
					message : 'What will be the title?',
					default: 'Map Test'
				}
			];

			this.prompt(prompts, function (props) {
				this.appName = props.appName;
				this.appTitle = props.appTitle;
				done();
			}.bind(this));
		},

		scaffoldFolders: function () {			
			this.mkdir('app');
			this.mkdir('app/config');
			this.mkdir('app/css');
			this.mkdir('app/css/scss');
			this.mkdir('app/data');
			this.mkdir('app/graphics');
			this.mkdir('app/graphics/ui');
			this.mkdir('app/js');
			this.mkdir('app/js/lib');
			console.log('\nSuccessfully created directories.');
		},
		
		copyProjectFiles: function () {
			console.log('\nCopying application files.');
			// general yeoman/bower/node/git resources
			//this.copy('_package.json', 'package.json');
			
			this.copy('_bower.json', 'bower.json');
			this.copy('_gitignore', '.gitignore');
			this.copy('Gruntfile.js', 'Gruntfile.js');
			
			this.copy('.jshintrc', '.jshintrc');
			this.copy('editorconfig', 'editorconfig');

			this.template("maptemplate/config/app-config.js", "app/config/app-config.js");
			this.template("maptemplate/index.html", "app/index.html");
			this.template("_package.json", "package.json");			
			//this.template("Gruntfile.js", "Gruntfile.js");
			
			// template map resources	
			this.copy('maptemplate/css/global.css', 'app/css/global.css');
			this.copy('maptemplate/css/scss/custom.scss', 'app/css/scss/custom.scss');
			this.copy('maptemplate/graphics/ui/ajax-loader.gif', 'app/graphics/ui/ajax-loader.gif');
			//this.copy('maptemplate/graphics/map.jpg', 'app/graphics/map.jpg');
			this.copy('maptemplate/js/local.js', 'app/js/local.js');
			this.copy('maptemplate/config/dojo-config.js', 'app/config/dojo-config.js');					
			this.copy('maptemplate/data/sampledata.json', 'app/data/sampledata.json');
			
			console.log('\nSuccessfully copied application files.');
		},

		getDependencies: function() {
			var done = this.async();
			console.log('\nStarting to install dependencies using Bower.');
			this.bowerInstall('', function(){
				console.log('\nSuccessfully installed Bower dependencies.');
			});
			console.log('\nStarting to install dependencies using Node Package Manager (NPM)');
			this.npmInstall('', function(){
				console.log('\nSuccessfully installed NPM dependencies.');
			});
		}			
	});
