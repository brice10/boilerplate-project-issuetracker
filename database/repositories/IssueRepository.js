const Issue = require('../collections/Issue');
const mongoose = require('mongoose');

// A king of interface made to implement all Basics operations 
// on Issues in database
class IssueRepository {
    static model = new Issue()._model;

    constructor() {}

    async find(filter) {
        return await IssueRepository.model.find(filter);
    }

    async create(issue) {
        issue._id = new mongoose.Types.ObjectId();
        return await (new IssueRepository.model(issue)).save();
    }

    async update(_id, issue) {
        return await IssueRepository.model.findByIdAndUpdate(_id, issue);
    }

    async delete(_id) {
        return await IssueRepository.model.findByIdAndDelete(_id);
    }

    async deleteAll() {
        return await IssueRepository.model.deleteMany({});
    }

    async findById(_id) {
        return await IssueRepository.model.findById(_id);
    }

}

module.exports = IssueRepository;