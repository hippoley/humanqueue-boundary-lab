// Real Gateway compatibility smoke test: deliberately narrower than Lab conformance.
// Requires an ISOLATED local Gateway. Mutates its test database.
import {makeAdapter} from '../conformance/adapters/humanqueue-gateway.mjs';
const a=makeAdapter(), x=await a.create(), y=await a.create();
const first=await a.resolve(x.id,'approve');
if(first.code!==200)throw Error('first resolve HTTP '+first.code);
const state=await a.state();
if(state.tasks.find(t=>t.id===y.id)?.status!=='awaiting_human')throw Error('wrong-task mutation');
const duplicate=await a.resolve(x.id,'approve');
if(duplicate.code!==409)throw Error('duplicate was not rejected: '+duplicate.code);
const after=await a.state();
const resolved=after.tasks.find(t=>t.id===x.id);
if(resolved?.status!=='simulated_completed')throw Error('resolved decision mismatch');
process.stdout.write(JSON.stringify({schema:'humanq.gateway-probe.v1',results:[{check:'exact_task_isolation',status:'PASS'},{check:'duplicate_resolution',status:'PASS'}],untested:['native_resume','side_effect_idempotency','crash_recovery','full_audit_mapping']},null,2)+'\n');
