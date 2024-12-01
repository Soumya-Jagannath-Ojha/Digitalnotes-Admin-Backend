import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    regdNo: { type: String, unique: true, default: "" },
    phno: { type: Number, unique: true, default: "" },
    dob: { type: Date, default: "" },
    gender: { type: String, default: "" },
    branch: { type: String, default: "" },
    sem: { type: String, default: "" },
    block: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], //reviews array
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }], //bookmark array
    createdAt: { type: Date, default: Date.now }
});

const Users = mongoose.model("User", userSchema);

export default Users;
