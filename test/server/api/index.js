'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const IndexPlugin = require('../../../server/api/index');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [IndexPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Index Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        done();
    });


    lab.test('it returns the default message', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Root./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Company Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/company'
        };

        done();
    });


    lab.test('it returns the default message', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Company./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Company Plugin 1', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/company/1'
        };

        done();
    });


    lab.test('it returns the default message 1', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Company 1./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Student Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/student'
        };

        done();
    });


    lab.test('it returns the default message', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Student./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Student Plugin 1', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/student/1'
        };

        done();
    });


    lab.test('it returns the default message 1', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Student 1./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Internship Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/internship'
        };

        done();
    });


    lab.test('it returns the default message', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Internship./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Internship Plugin 1', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/internship/1'
        };

        done();
    });


    lab.test('it returns the default message 1', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/Internship 1./i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
