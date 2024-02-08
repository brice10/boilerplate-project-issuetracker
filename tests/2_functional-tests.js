const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const IssueRepository = require('../database/repositories/IssueRepository');

suite('Functional Tests', function () {
  const CollectionRepository = new IssueRepository();

  this.beforeEach(async function () {
    await CollectionRepository.deleteAll();
  });

  this.afterEach(async function () {
    await CollectionRepository.deleteAll();
  });

  suite('Create an issue on a project', function () {

    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/sample_project')
        .send({
          issue_title: "Lolo Juice Issue",
          issue_text: "Another Issue caused by Lolo Juice ",
          created_by: "Lolo Juice",
          assigned_to: "Lolo Juice Friend",
          status_text: "In QA"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody, 'The response body must be truthy !');
          assert.isOk(resBody.assigned_to, 'assigned_to attribute must be truthy !');
          assert.isOk(resBody.status_text, 'status_text attribute must be truthy !');
          assert.isTrue(resBody.open, 'open attribute must be true !');
          assert.isOk(resBody._id, '_id attribute must be truthy !');
          assert.isOk(resBody.issue_title, 'issue_title attribute must be truthy !');
          assert.isOk(resBody.issue_text, 'issue_text attribute must be truthy !');
          assert.isOk(resBody.created_by, 'created_by attribute must be truthy !');
          assert.isOk(resBody.created_on, 'created_on attribute must be truthy !');
          assert.isOk(resBody.updated_on, 'updated_on attribute must be truthy !');

          assert.equal(resBody.issue_title, 'Lolo Juice Issue', 'Expected: Lolo Juice Issue, Actual: ' + resBody.issue_title);
          assert.equal(resBody.issue_text, 'Another Issue caused by Lolo Juice ', 'Expected: Another Issue caused by Lolo Juice , Actual: ' + resBody.issue_text);
          assert.equal(resBody.created_by, 'Lolo Juice', 'Expected: Lolo Juice, Actual: ' + resBody.created_by);
          assert.equal(resBody.assigned_to, 'Lolo Juice Friend', 'Expected: Lolo Juice Friend, Actual: ' + resBody.assigned_to);
          assert.equal(resBody.status_text, 'In QA', 'Expected: In QA, Actual: ' + resBody.status_text);

          done();
        });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/sample_project')
        .send({
          issue_title: "Lolo Juice Issue",
          issue_text: "Another Issue caused by Lolo Juice ",
          created_by: "Lolo Juice"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody, 'The response body must be truthy !');
          assert.isString(resBody.assigned_to, 'assigned_to attribute must be an empty string !');
          assert.isString(resBody.status_text, 'status_text attribute must be an empty string !');
          assert.isTrue(resBody.open, 'open attribute must be true !');
          assert.isOk(resBody._id, '_id attribute must be truthy !');
          assert.isOk(resBody.issue_title, 'issue_title attribute must be truthy !');
          assert.isOk(resBody.issue_text, 'issue_text attribute must be truthy !');
          assert.isOk(resBody.created_by, 'created_by attribute must be truthy !');
          assert.isOk(resBody.created_on, 'created_on attribute must be truthy !');
          assert.isOk(resBody.updated_on, 'updated_on attribute must be truthy !');

          assert.equal(resBody.issue_title, 'Lolo Juice Issue', 'Expected: Lolo Juice Issue, Actual: ' + resBody.issue_title);
          assert.equal(resBody.issue_text, 'Another Issue caused by Lolo Juice ', 'Expected: Another Issue caused by Lolo Juice , Actual: ' + resBody.issue_text);
          assert.equal(resBody.created_by, 'Lolo Juice', 'Expected: Lolo Juice, Actual: ' + resBody.created_by);
          assert.equal(resBody.assigned_to, '', 'Expected: "", Actual: ' + resBody.assigned_to);
          assert.equal(resBody.status_text, '', 'Expected: "", Actual: ' + resBody.status_text);

          done();
        });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/sample_project')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isOk(resBody.error);
          assert.equal(resBody.error, 'required field(s) missing');

          done();
        });
    });

  });

  suite('View issues on a project', function () {

    test('View issues on a project: GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/sample_project')
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isArray(resBody);

          done();
        });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/sample_project?open=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isArray(resBody);

          done();
        });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/sample_project?open=true&assigned_to=Joe')
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isArray(resBody);

          done();
        });
    });

  });

  suite('Update an issue on a project', function () {

    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
      CollectionRepository.create({
        issue_title: "Lolo Juice Issue",
        issue_text: "Another Issue caused by Lolo Juice ",
        created_by: "Lolo Juice",
        assigned_to: "Lolo Juice Friend",
        status_text: "In QA"
      }).then(function (issueSaved) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/sample_project')
          .send({
            _id: issueSaved._id,
            open: false
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);

            const resBody = res.body;

            assert.isOk(resBody);
            assert.isOk(resBody.result);
            assert.isOk(resBody._id);

            assert.equal(resBody.result, 'successfully updated');
            assert.equal(resBody._id, issueSaved._id);

            done();
          });
      });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
      CollectionRepository.create({
        issue_title: "Lolo Juice Issue",
        issue_text: "Another Issue caused by Lolo Juice ",
        created_by: "Lolo Juice",
        assigned_to: "Lolo Juice Friend",
        status_text: "In QA"
      }).then(function (issueSaved) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/sample_project')
          .send({
            _id: issueSaved._id,
            open: false,
            issue_title: 'Lolos'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);

            const resBody = res.body;

            assert.isOk(resBody);
            assert.isOk(resBody.result);
            assert.isOk(resBody._id);

            assert.equal(resBody.result, 'successfully updated');
            assert.equal(resBody._id, issueSaved._id);

            done();
          });
      });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/sample_project')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isOk(resBody.error);
          assert.equal(resBody.error, 'missing _id');

          done();
        });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
      CollectionRepository.create({
        issue_title: "Lolo Juice Issue",
        issue_text: "Another Issue caused by Lolo Juice ",
        created_by: "Lolo Juice",
        assigned_to: "Lolo Juice Friend",
        status_text: "In QA"
      }).then(function (issueSaved) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/sample_project')
          .send({ _id: issueSaved._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);

            const resBody = res.body;

            assert.isOk(resBody);
            assert.isOk(resBody._id);
            assert.isOk(resBody.error);
            assert.equal(resBody._id, issueSaved._id);
            assert.equal(resBody.error, 'no update field(s) sent');

            done();
          });
      });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/sample_project')
        .send({ _id: 'invalid_id' })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isOk(resBody._id);
          assert.isOk(resBody.error);
          assert.equal(resBody._id, 'invalid_id');
          assert.equal(resBody.error, 'could not update');

          done();
        });
    });

  });

  suite('Delete an issue on a project', function () {

    test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
      CollectionRepository.create({
        issue_title: "Lolo Juice Issue",
        issue_text: "Another Issue caused by Lolo Juice ",
        created_by: "Lolo Juice",
        assigned_to: "Lolo Juice Friend",
        status_text: "In QA"
      }).then(function (issueSaved) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/sample_project')
          .send({ _id: issueSaved._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);

            const resBody = res.body;

            assert.isOk(resBody);
            assert.isOk(resBody.result);
            assert.isOk(resBody._id);

            assert.equal(resBody.result, 'successfully deleted');
            assert.equal(resBody._id, issueSaved._id);

            done();
          });
      });


    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/sample_project')
        .send({ _id: 'invalid_id' })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isOk(resBody._id);
          assert.isOk(resBody.error);
          assert.equal(resBody._id, 'invalid_id');
          assert.equal(resBody.error, 'could not delete');

          done();
        });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/sample_project')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);

          const resBody = res.body;

          assert.isOk(resBody);
          assert.isOk(resBody.error);
          assert.equal(resBody.error, 'missing _id');

          done();
        });
    });

  });

});
