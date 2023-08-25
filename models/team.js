const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema ({
    team_name: String,
    users : [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    projects : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
});



module.exports = mongoose.model('Team', TeamSchema);