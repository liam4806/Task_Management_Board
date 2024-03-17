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
    ],
    sentRequest:[{
    type: Schema.Types.ObjectId, ref: "User"
    }],
    request: [{
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    name: {type: String, default: ""}
    }],
    friendsList: [
    {type: Schema.Types.ObjectId, 
    ref: "User"}
    ],
    totalRequest: {type: Number, default:0}
});



module.exports = mongoose.model('User', UserSchema);