import {makeAdapter} from './adapter.mjs';
const make=async()=>makeAdapter();
const checks=[];
async function check(name,fn){try{const evidence=await fn();checks.push({name,status:'PASS',evidence});}catch(error){checks.push({name,status:'FAIL',evidence:String(error.message||error)});}}
const assert=(value,message)=>{if(!value)throw Error(message)};
await check('request_identity',async()=>{const a=await make(),x=await a.create(),y=await a.create();assert(x.id&&y.id&&x.id!==y.id,'IDs must be distinct');return 'distinct IDs';});
await check('wrong_task_protection',async()=>{const a=await make(),x=await a.create(),y=await a.create();await a.resolve(x.id,'approve');const s=await a.state();assert(s.tasks.find(t=>t.id===y.id).status==='awaiting_human','unrelated task mutated');return 'other task remains pending';});
await check('duplicate_resolution',async()=>{const a=await make(),x=await a.create();await a.resolve(x.id,'approve');const before=(await a.state()).events.length;const result=await a.resolve(x.id,'approve');assert(result.code===409,'must fail 409');assert((await a.state()).events.length===before,'duplicate appended events');return '409 without new audit events';});
await check('invalid_decision',async()=>{const a=await make(),x=await a.create();const result=await a.resolve(x.id,'invalid');assert(result.code===400,'invalid decision not rejected');assert((await a.state()).tasks.find(t=>t.id===x.id).status==='awaiting_human','invalid decision mutated task');return '400; task remains pending';});
await check('audit_consistency',async()=>{const a=await make(),x=await a.create();await a.resolve(x.id,'reject');const events=(await a.state()).events.filter(e=>e.taskId===x.id);assert(JSON.stringify(events.map(e=>e.type))===JSON.stringify(['boundary.created','boundary.resolved','simulation.stopped']),'event sequence mismatch');return 'created → resolved → stopped';});
for(const name of ['crash_recovery','native_agent_resume','external_side_effects','authentication'])checks.push({name,status:'NOT_TESTED',evidence:'Out of scope for in-memory simulation'});
const report={schema:'humanq.boundary-conformance.v1',subject:'HumanQueue Boundary Lab reference simulation',generated_at:new Date().toISOString(),checks,summary:{pass:checks.filter(c=>c.status==='PASS').length,fail:checks.filter(c=>c.status==='FAIL').length,not_tested:checks.filter(c=>c.status==='NOT_TESTED').length}};
process.stdout.write(JSON.stringify(report,null,2)+'\n');
if(checks.some(c=>c.status==='FAIL'))process.exitCode=1;
