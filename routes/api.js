'use strict';

const IssueService = require('../database/services/IssueService');
const IssueServiceHelper = new IssueService();

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      try {
        let filter = req.query;
        filter.project_name = project;
        return res.json(await IssueServiceHelper.find(filter));
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to get Issues list in the database', data: error })
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      try {
        return res.json(await IssueServiceHelper.create(req.body, project));
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to create an Issue in the database', data: error })
      }
    })

    .put(async function (req, res) {
      try {
        return res.json(await IssueServiceHelper.update(req.body));
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to update an Issue in the database', data: error })
      }
    })

    .delete(async function (req, res) {
      try {
        return res.json(await IssueServiceHelper.delete(req.body));
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to delete the Issue in the database', data: error })
      }
    });

};
