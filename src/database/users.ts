import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required:true
    },
    accessToken: {
        type: String,
        required:true
    },
    refreshToken: {
        type: String,
        required:true
    },
    locationId: {
        type: String,
        required:true
    }
})


let userModel: any;
if (mongoose.models.users) {
    userModel = mongoose.models.users
}
else {
    userModel=mongoose.model('users',userSchema)
}

export default userModel