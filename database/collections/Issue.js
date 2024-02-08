const mongoose = require('mongoose');

// MongoDB collection for Issues
class Issue {
    static _model;
    
    constructor(collectionName) {
        this._collectionName = collectionName || 'Issue';
        this._model = mongoose.model(this._collectionName, this._schema);
    }

    _schema = new mongoose.Schema({
        project_name: {
            type: String
        },
        _id: {
            type: String
        },
        issue_title: {
            type: String
        },
        issue_text: {
            type: String
        },
        created_on: {
            type: Date
        },
        updated_on: {
            type: Date
        },
        created_by: {
            type: String
        },
        assigned_to: {
            type: String
        },
        open: {
            type: Boolean
        },
        status_text: {
            type: String
        }
    })
}

module.exports = Issue;