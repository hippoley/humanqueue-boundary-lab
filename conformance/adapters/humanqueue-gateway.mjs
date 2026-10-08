// Adapter for an isolated real HumanQueue Gateway. Uses only HTTP; never sets resume targets.
// Configure HUMANQ_GATEWAY_URL and (if required) HUMANQ_GATEWAY_TOKEN.
// Do not point at production: every conformance check creates and resolves requests.
import {randomUUID} from 'node:crypto';
const base=process.env.HUMANQ_GATEWAY_URL;
if(!base)throw Error('HUMANQ_GATEWAY_URL is required; use an isolated temporary Gateway');
const root=base.replace(/\/$/,'');
const token=process.env.HUMANQ_GATEWAY_TOKEN||'';
async function http(route,method='GET',body){
 const r=await fetch(root+route,{method,headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
 const data=await r.json().catch(()=>({}));
 return {code:r.status,data};
}
export function makeAdapter(){
 const ids=[];
 return {
  async create(){
   const ref='boundary-conformance-'+randomUUID();
   const r=await http('/v1/human','POST',{uri:'human://approve',source:'boundary-conformance',ref,title:'Conformance probe '+ref,summary:'Isolated conformance approval probe',options:[{id:'approve',label:'Approve'},{id:'reject',label:'Reject'}],resume:{mode:'none'}});
   if(r.code!==201||!r.data.request?.id)throw Error('Gateway create failed: HTTP '+r.code);
   ids.push(r.data.request.id);
   return {id:r.data.request.id};
  },
  async resolve(id,decision){
   if(!ids.includes(id))return {code:404};
   const r=await http('/v1/requests/'+encodeURIComponent(id)+'/resolve','POST',{actor:'conformance-operator',actor_kind:'human',action:decision});
   return {code:r.code};
  },
  async state(){
   const tasks=[];const events=[];
   for(const id of ids){
    const r=await http('/v1/requests/'+encodeURIComponent(id));
    if(r.code!==200)throw Error('Gateway inspect failed: HTTP '+r.code);
    const q=r.data.request;
    tasks.push({id,status:q.status==='resolved'?(q.resolution?.action==='reject'?'rejected':'simulated_completed'):(q.status==='pending'||q.status==='claimed'?'awaiting_human':q.status)});
    // Gateway event vocabulary is not identical to Boundary Lab events. Not fabricated.
    for(const e of r.data.events||[])events.push({taskId:id,type:e.type||e.event_type||'gateway.event'});
   }
   return {tasks,events};
  }
 };
}
