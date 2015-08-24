module.exports = function(grunt) { // jshint ignore:line

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('cool-reporter') // jshint ignore:line
            },
            gruntfile: ['Gruntfile.js'],
            src: ['src/**/*.js']
        },

        copy: {
            js: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.js'],
                dest: 'release/',
                ext: '.js',
                extDot: 'last'
            }
        },

        uglify: {
            options: {
                footer: grunt.util.linefeed,
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'release/',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:jshint:src', 'newer:copy', 'newer:uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('default', 'jshint: gruntfile.js and source code', ['jshint']);
    grunt.registerTask('dev', 'start watch', ['watch']);
    grunt.registerTask('build', 'btoucuild', ['jshint:src', 'copy', 'uglify']);
};
