const IssueRepository = require('../repositories/IssueRepository');

// A king of interface made to implement all advanced operations 
// on Issues before saving them in database
class IssueService {
    issueRepository;

    constructor() {
        this.issueRepository = new IssueRepository();
    }

    async find(filter) {
        return await this.issueRepository.find(filter);
    }

    async create(requestBody, project) {
        if (!requestBody.issue_title || !requestBody.issue_text || !requestBody.created_by) {
            return { error: 'required field(s) missing' };
        }

        let issue = {
            project_name: project,
            issue_title: requestBody.issue_title,
            issue_text: requestBody.issue_text,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: requestBody.created_by,
            assigned_to: requestBody.assigned_to ? requestBody.assigned_to : "",
            open: true,
            status_text: requestBody.status_text ? requestBody.status_text : ""
        }

        const savedIssue = await this.issueRepository.create(issue)

        return {
            _id: savedIssue._id.toString(),
            issue_title: savedIssue.issue_title,
            issue_text: savedIssue.issue_text,
            created_on: savedIssue.created_on,
            updated_on: savedIssue.updated_on,
            created_by: savedIssue.created_by,
            assigned_to: savedIssue.assigned_to,
            open: savedIssue.open,
            status_text: savedIssue.status_text
        }
    }

    async update(requestBody) {
        if (!requestBody._id) {
            return { error: 'missing _id' }
        }
        let documentFound = await this.issueRepository.findById(requestBody._id)

        if (documentFound && !requestBody.issue_title && !requestBody.issue_text && !requestBody.created_by && !requestBody.assigned_to && !requestBody.status_text && (requestBody.open === null || requestBody.open === undefined)) {
            return {
                error: 'no update field(s) sent',
                _id: requestBody._id
            };
        }

        if (!documentFound) {
            return {
                error: 'could not update',
                _id: requestBody._id
            };
        }

        let updatedDocument = await this.issueRepository.update(documentFound._id, {
            issue_title: requestBody.issue_title ? requestBody.issue_title : documentFound.issue_title,
            issue_text: requestBody.issue_text ? requestBody.issue_text : documentFound.issue_text,
            created_by: requestBody.created_by ? requestBody.created_by : documentFound.created_by,
            assigned_to: requestBody.assigned_to ? requestBody.assigned_to : documentFound.assigned_to,
            status_text: requestBody.status_text ? requestBody.status_text : documentFound.status_text,
            open: requestBody.open === undefined || requestBody.open === null ? documentFound.open: requestBody.open,
            updated_on: new Date()
        })

        return {
            result: 'successfully updated',
            _id: requestBody._id
        };
    }

    async delete(requestBody) {
        if (!requestBody._id) {
            return { error: 'missing _id' };
        }

        let documentFound = await this.issueRepository.findById(requestBody._id)

        if (!documentFound) {
            return {
                error: 'could not delete',
                _id: requestBody._id
            };
        } else {
            let deleteIssue = await this.issueRepository.delete(documentFound._id);

            return {
                result: 'successfully deleted',
                _id: documentFound._id
            };
        }
    }

}

module.exports = IssueService;