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
                    'FrameworkPrj1Control/FrameworkPrj1Control.js': ['FrameworkPrj1Control/FrameworkPrj1Control.js'],
                }
            }
        }
    });

    // Load npm tasks 
    grunt.loadNpmTasks('/grunt-terser');

    // Register grunt tasks
    grunt.registerTask('Uglify', [
        'terser:release',
    ]);
};