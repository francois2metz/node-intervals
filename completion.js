module.exports = function(conf) {
    process.stdout.write(require('fs').readFileSync(__dirname +'/completions/completion.sh', 'utf8'));
}
