//const mongoose = require ('mongoose');
import * as mongoose from 'mongoose';
import { PasswordManager } from '../services/svc-password';

// An interface that describes the properties that are required to create a user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface tha describes the properties that a user pass
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

// An interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    },
    { // modifying the json output
        toJSON:{
           transform(doc, ret) {
               ret.id = ret._id;
               delete ret._id;
               delete ret.password;
               delete ret.__v;
           } 
        }
    }
);

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await PasswordManager.toHash(this.get('password'));
        this.set('password',hashed);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User',userSchema);

//const buildUser = (attrs: UserAttrs) => {
//    return new User(attrs);
//};
//export {User, buildUser};

export {User};