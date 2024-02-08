const mongoose = require('mongoose');

// MongoDB collection for Issues
class Issue {
    static _model;

    constructor(collectionName) {
        this._collectionName = collectionName || 'Issue';
        this._model = mongoose.model(this._collectionName, this._schema);

        this._schema.pre('save', function (next) {
            if (!this.created_on) {
                this.created_on = new Date();
            }
            this.updated_on = new Date();
            next()
        })
    }

    _schema = new mongoose.Schema({
        project_name: {
            type: String,
            require: true,
            select: false
        },
        _id: {
            type: String
        },
        issue_title: {
            type: String,
            require: true
        },
        issue_text: {
            type: String,
            require: true,
        },
        created_by: {
            type: String,
            require: true,
        },
        assigned_to: {
            type: String,
            default: ''
        },
        status_text: {
            type: String,
            default: ''
        },
        open: {
            type: Boolean,
            default: true
        },
        created_on: {
            type: Date
        },
        updated_on: {
            type: Date
        }
    })
}

module.exports = Issue;