const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
        },
        userID: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        
        leavesBalance: {
            type: Array,
            default: leaveBalanceDefault,
        },
        leaves: [],
    },
    { timestamps: true }
);

const employeeModel = mongoose.model("employee", employeeSchema);
module.exports = employeeModel;
