/**
 * Set Accept header
 */
function accept(accept) {
    return function(method, request, next) {
        request.headers['Accept'] = accept;
        next();
    }
}

var sporeDesc = {
    base_url : 'https://api.myintervals.com',
    formats : ["json", "xml"],
    authentication: true,
    methods: {
        me: {
            path: '/me',
            method: 'GET'
        },
        client: {
            path: '/client/',
            method: 'GET',
            optional_params: ['active', 'search', 'projectsonly',
                              'offset', 'limit']
        },
        project: {
            path: '/project/',
            method: 'GET',
            optional_params: ['clientid', 'managerid', 'name',
                              'datestart', 'dateend', 'search',
                              'active', 'billable', 'personid',
                              'offset', 'limit']
        },
        timer: {
            path: '/timer',
            method: 'GET'
        }
    }
};

var token = 'you_token';

var spore = require('spore');
var client = spore.createClient(sporeDesc);
client.enable(spore.middlewares.basic(token, 'X'));
client.enable(accept('application/json'));

client.project({active: 't'}, function(err, res) {
    console.log(err, res);
});
