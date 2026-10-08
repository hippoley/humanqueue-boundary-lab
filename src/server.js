import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {BoundaryLab} from './core.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const lab=new BoundaryLab();
const server=http.createServer(async(req,res)=>{
 const send=(status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(type==='application/json'?JSON.stringify(data):data)};
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET'&&pathname==='/')return send(200,fs.readFileSync(path.join(root,'index.html'),'utf8'),'text/html; charset=utf-8');
  if(req.method==='GET'&&pathname==='/api/state')return send(200,lab.snapshot());
  if(req.method==='POST'&&(pathname==='/api/tasks'||/^\/api\/tasks\/[0-9a-f-]+\/decision$/.test(pathname))){
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192)return send(413,{error:'Request too large'});}
    let body;try{body=JSON.parse(raw);}catch{return send(400,{error:'Invalid JSON'});}
    if(pathname==='/api/tasks'){try{return send(201,{task:lab.create(body)});}catch(e){return send(400,{error:e.message});}}
    const outcome=lab.decide(pathname.split('/')[3],body);return send(outcome.code,outcome);
  }
  return send(404,{error:'Not found'});
 }catch(e){return send(500,{error:'Unexpected server error'});}
});
if(process.env.NODE_ENV!=='test')server.listen(Number(process.env.PORT||3000),()=>console.log('HumanQueue Boundary Lab: http://localhost:'+ (process.env.PORT||3000)));
export {server,lab};
