module.exports = {
    options: {
        files: [{
            expand: true,
            cwd: 'app/',
            src: ['*.html'],
            dest: 'output/'
        }, ],
    },
    dev: {
        filepath: 'app/data/gconfig.dev.json',
        removeOriginalUnmatchedMeta: true,
        mergeFiles:[
            'app/data/gconfig.defaults.json'
        ],
        mergeConfigs:['gconfigMergeGrunt']
    },
    int: {
        filepath: 'app/data/gconfig.int.json'
    },
    prod: {
        filepath: 'app/data/gconfig.dist.json'
    }
};
