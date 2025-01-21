const mongoose  = require("mongoose");
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://namastedev:My2X1LSKptuvoGHn@namastenode.hh55e.mongodb.net/devTinder"
    );
};

module.exports = {connectDB};

