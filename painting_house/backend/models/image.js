const { Mongoose } = require('./mongooseConnection')

const imageSchema = new Mongoose.Schema({
    idInBucket: String,
    name: String,
    contentType: String
}, {
    toJSON: {
        transform: function (document, returnedObject) {
            delete returnedObject._id; // Exclude _id field from the transformed object
        },
    }
})

module.exports = { imageSchema }