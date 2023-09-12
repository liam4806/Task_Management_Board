const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name: String,
    email: String,
    Googleid:String,
    teamids: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Team'
        }
    ]
});



module.exports = mongoose.model('User', UserSchema);