/**
 * 
 * @param {IGrunt} grunt Grunt object 
 */
module.exports = function (grunt) {
    // Grunt build configuration.
    grunt.initConfig({
        // General
        pkg: grunt.file.readJSON('package.json'),
        // Task: 'terser'
        terser: {
            release: {
                options: {
                    output: {
                        beautify: false,
                    }
                },
                files: {
                    'FrameworkControlJs1/Source.min.js': ['FrameworkControlJs1/Source.js'],
                }
            }
        },
        // Task: 'copy'
        copy: {
            debug: {
                files: {
                    'FrameworkControlJs1/Source.min.js': ['FrameworkControlJs1/Source.js'],
                }
            },
        },
    });

    // Load npm tasks 
    grunt.loadNpmTasks('/grunt-terser');
    grunt.loadNpmTasks('/grunt-contrib-copy');

    // Register grunt tasks
    grunt.registerTask('Release', [
        'terser:release',
    ]);

    grunt.registerTask('Debug', [
        'copy:debug',
    ]);
};