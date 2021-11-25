let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

before(done => {
    server.on("app_started", function () {
        done()
    })
});

let should = chai.should();

chai.use(chaiHttp);

describe("Server testing", () => {
    it("Check Server", (done) => {
        chai.request(server)
            .get('/healthcheck')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
                res.text.match("Server Running");
                done();
            });

    });
});

describe('/Logging check', () => {
    it('it should check for logging user', (done) => {
        let userData = {
            role: "student",
            ID: "101803095",
            password: "12345"
        }

        chai.request(server)
            .post('/signin')
            .send(userData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(1);
                res.body[0].RollNo.should.be.eql(userData.ID);
                done();
            });
    });
});

describe('/Get Faculty List', () => {
    it('it should check for Faculty count', (done) => {
        chai.request(server)
            .get('/getFacultylist')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.be.above(0);
                done();
            });
    });
});
