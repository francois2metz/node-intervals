/**
 * Spore description of myintervals api
 */
module.exports = {
    base_url : 'https://api.myintervals.com',
    formats : ['json', 'xml'],
    authentication: true,
    unattended_params: false,
    meta : {
      documentation : 'http://www.myintervals.com/api/'
    },

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
            // NOTE: personid parameter seem buggy
            optional_params: ['clientid', 'managerid', 'name',
                              'datestart', 'dateend', 'search',
                              'active', 'billable', 'personid',
                              'offset', 'limit']
        },
        worktype: {
            path: '/worktype/',
            method: 'GET',
            optional_params: ['active', 'offset', 'limit']
        },
        project_worktype: {
            path: '/projectworktype/',
            method: 'GET',
            required_params: ['projectid'],
            // NOTE: personid parameter seem buggy
            optional_params: ['active', 'personid', 'offset', 'limit']
        },
        project_module: {
            path: '/projectmodule/',
            method: 'GET',
            required_params: ['projectid'],
            // NOTE: personid parameter seem buggy
            optional_params: ['active', 'personid',
                              'offset', 'limit']
        },
        timer: {
            path: '/timer',
            method: 'GET'
        },
        time: {
            path: '/time/',
            method: 'GET',
            optional_params: ['activeonly', 'moduleid', 'taskid', 'worktypeid',
                              'personid', 'clientid', 'projectid', 'milestoneid',
                              'date', 'datebegin', 'dateend', 'billable', 'sortfield',
                              'sortdir', 'offset', 'limit']
        },
        add_time: {
            path: '/time/',
            method: 'POST',
            expected_status: [201]
        }
    }
};
