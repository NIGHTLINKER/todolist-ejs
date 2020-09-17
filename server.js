// npm i nodemon -D << -D를 하면 package.json에 devDependency 설정으로 된다.

const express=require("express");
const app=express();
const dotenv=require("dotenv");
// 파일 이름이 index일때는 생략가능
// const {pool}=require("./db/index");
const {pool}=require("./db")
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// ejs를 view의 template engine으로 사용하기 위해
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/views`));

app.get("/", async (req, res)=>{
	try{
		const data=await pool.query("select * from todo");
		console.log(data[0]);
		return res.render("index", {
			data:data[0],
		});
	}catch(err){
		console.log(err);
		res.render("error", {
			title:"에러",
			data:"할일 목록 가져오기에 실패하였습니다.",
		})
	}
});

app.post("/add", async (req, res)=>{
	console.log(req.body);
	const {todo}=req.body;
	try{
		const data=await pool.query("insert into todo SET ?", [{
			todo:todo, checked:"false", 
		}]);
		console.log(data);
		// 렌더링을 하지않고 /로 넘겨서 자동 새로고침 효과가 난다.
		res.redirect("/");
	}catch(err){
		console.log(err);
		res.render("error", {
			title:"에러",
			data:"할일 목록 추가에 실패하였습니다.",
		})
	}
	// return res.render("index");
});

app.get("/update/check/:id", async (req, res)=>{
	console.log(req.params);
	console.log(req.query);
	const {id}=req.params;
	const {checked}=req.query;
	try{
		const data=await pool.query("update todo set checked = ? where id = ?", [
			checked, id
		]);
		res.redirect("/");
	}catch(err){
		res.render("error",{
			title:"error",
			data:"체크목록 수정에 실패하였습니다.",
		})
	}
})

app.get("/update/todo/:id/", async (req, res)=>{
	console.log(req.params);
	console.log(req.query);
	const {id}=req.params;
	const {todo}=req.query;
	try{
		const data=await pool.query("update todo set todo = ? where id = ?", [
			todo, id
		]);
		res.redirect("/");
	}catch(err){
		res.render("error",{
			title:"error",
			data:"할일 목록 수정에 실패하였습니다.",
		})
	}
});

app.get("/delete/todo/:id/", async(req, res)=>{
	// console.log(req.params);
	const {id} = req.params;
	try {
		const data=await pool.query("delete from todo where ?", [{id}]);
		res.redirect("/");
	} catch (error) {
		res.render("error", {
			title:"error",
			data:"할일 목록 삭제에 실패하였습니다."
		})
	}
})

app.listen(8000, ()=>console.log("8000포트 실행중"));