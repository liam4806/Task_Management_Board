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
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }],
    request: [{
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: {type: String, default: ""}
    }],
    friendsList: [{
    friendId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    friendName: {type: String, default: ""}
    }],
    totalRequest: {type: Number, default:0}
});



module.exports = mongoose.model('User', UserSchema);