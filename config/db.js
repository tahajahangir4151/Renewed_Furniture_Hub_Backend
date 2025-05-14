import mongoose from "mongoose";
import colors from "colors";

const ConnectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅✅✅ Application is connected with ${connect.connection.host}`.bgGreen
        .underline
    );
  } catch (error) {
    console.log(
      `❌❌❌ Unable to connect with database : ${error.message}`.bgRed
        .underline
    );
    process.exit(1);
  }
};

export default ConnectDb;
 