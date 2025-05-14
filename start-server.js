import dotenv from "dotenv";
dotenv.config();

import open from "open";
import { spawn } from "child_process";

const url = "http://localhost:5000/api-docs";

//Open browser once at restart first time by node
//Open browsers new window at https://localhost:5000 with swagger-UI
open(url);

// Start nodemon process after open first time and donot open again just refresh the page
spawn("npx", ["nodemon", "server.js"], {
  stdio: "inherit",
  shell: true,
});
