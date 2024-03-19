import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, filter: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model(usersCollection, userSchema);

export default UserModel;