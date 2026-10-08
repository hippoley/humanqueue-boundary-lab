// Deliberately broken reference adapter: it resolves every waiting task when one is approved.
// Use ONLY for negative testing of the conformance runner.
export function makeAdapter() {
  let count=0;
  const tasks=[];
  const events=[];
  return {
    async create(){
      const task={id:'broken-'+(++count),status:'awaiting_human'};
      tasks.push(task);
      events.push({taskId:task.id,type:'boundary.created'});
      return {...task};
    },
    async resolve(id,decision){
      const task=tasks.find(t=>t.id===id);
      if(!task)return {code:404};
      if(task.status!=='awaiting_human')return {code:409};
      if(!['approve','reject'].includes(decision))return {code:400};
      // This is the intentional fault: unrelated tasks also leave the waiting state.
      for(const waiting of tasks)waiting.status=decision==='approve'?'simulated_completed':'rejected';
      events.push({taskId:id,type:'boundary.resolved'});
      events.push({taskId:id,type:decision==='approve'?'simulation.continued':'simulation.stopped'});
      return {code:200,task:{...task}};
    },
    async state(){return {tasks:tasks.map(t=>({...t})),events:events.map(e=>({...e}))};}
  };
}
