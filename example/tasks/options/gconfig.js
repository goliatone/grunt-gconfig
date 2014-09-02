module.exports = {
    options: {
        files: [{
            expand: true,
            cwd: 'app/',
            src: ['*.html'],
            dest: '.tmp/'
        }, ],
    },
    dev: {
        filepath: 'app/data/gconfig.dev.json',
        removeOriginalUnmatchedMeta: true
    },
    int: {
        filepath: 'app/data/gconfig.int.json'
    },
    prod: {
        filepath: 'app/data/gconfig.dist.json'
    }
};
