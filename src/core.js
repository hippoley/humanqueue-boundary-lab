import {randomUUID} from 'node:crypto';
export class BoundaryLab {
  constructor(){this.tasks=new Map();this.events=[];this.sequence=0;}
  record(task,type,details={}){this.events.push({sequence:++this.sequence,taskId:task.id,type,details,at:new Date().toISOString()});}
  create({title,operation}={}){
    if(typeof title!=='string'||title.trim().length<3||title.length>160)throw Error('Title must be 3–160 characters');
    if(typeof operation!=='string'||operation.trim().length<3||operation.length>500)throw Error('Operation must be 3–500 characters');
    const task={id:randomUUID(),title:title.trim(),operation:operation.trim(),status:'awaiting_human',decision:null};
    this.tasks.set(task.id,task);this.record(task,'boundary.created');return structuredClone(task);
  }
  decide(id,{decision,actor,reason=''}={}){
    const task=this.tasks.get(id);
    if(!task)return {code:404,error:'Unknown task'};
    if(task.status!=='awaiting_human')return {code:409,error:'Already resolved; duplicate action prevented'};
    if(!['approve','reject'].includes(decision))return {code:400,error:'Invalid decision'};
    if(typeof actor!=='string'||actor.trim().length<2||actor.length>80)return {code:400,error:'Actor must be 2–80 characters'};
    if(typeof reason!=='string'||reason.length>500)return {code:400,error:'Invalid reason'};
    task.decision={decision,actor:actor.trim(),reason,at:new Date().toISOString()};
    this.record(task,'boundary.resolved',{decision,actor:task.decision.actor,reason});
    task.status=decision==='approve'?'simulated_completed':'rejected';
    this.record(task,decision==='approve'?'simulation.continued':'simulation.stopped',{sideEffects:false});
    return {code:200,task:structuredClone(task)};
  }
  snapshot(){return {tasks:[...this.tasks.values()].map(t=>structuredClone(t)),events:structuredClone(this.events)};}
}
