const mongoose = require("mongoose")

const householdSchema = mongoose.Schema({
    street: String,
    houseNumber: String,
    city: String,
    country: String
})

const Household = mongoose.model("Household", householdSchema)

module.exports = Household;