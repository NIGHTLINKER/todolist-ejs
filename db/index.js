const mysql=require("mysql2/promise");
const dotenv=require("dotenv");
dotenv.config();

const pool=mysql.createPool({
	host:"localhost",
	user:process.env.ID,
	password:process.env.PASSWORD,
	database:"todo-list",
	waitForConnections:true,
	connectionLimit:10,
	queueLimit:0,
});

module.exports={pool};