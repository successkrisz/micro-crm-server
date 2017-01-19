import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    email: {
        type: String,
        match: [
            /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/i,
            '{VALUE} is not a valid email address!'
        ],
        lowercase: true
    },
    phone: {
        type: String,
        match: /[\d+]*/,
        min: 3,
        max: 13
    },
    postcode: { type: String },
    address: { type: String },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        birthday: { type: String, match: /^[0-3][0-9]\/[01][0-9]\/[\d]{4}$/ }
    },
    notes: { type: String }
},
    {
        timestamps: true
    });

ClientSchema.set('collection', 'clients');

export default mongoose.model('Client', ClientSchema);
