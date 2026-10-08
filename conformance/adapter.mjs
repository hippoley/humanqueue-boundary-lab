import {BoundaryLab} from '../src/core.js';
export function makeAdapter() {
 const lab=new BoundaryLab();
 return {
  create: async()=>lab.create({title:'Conformance task',operation:'Simulate safe operation'}),
  resolve: async(id,decision)=>lab.decide(id,{decision,actor:'conformance:tester'}),
  state: async()=>lab.snapshot()
 };
}
