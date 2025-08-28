
import React, { useState } from 'react'
import NotesUpload from './steps/NotesUpload'
import ScopeForm from './steps/ScopeForm'
import TimelineView from './steps/TimelineView'
import LettersEditor from './steps/LettersEditor'
import TasksAndChecklist from './steps/TasksAndChecklist'
import type { CPRARequest, Timeline } from './types'

/** Root application component orchestrating the workflow steps. */
export default function App(){
  const [step,setStep]=useState(0)
  const [req,setReq]=useState<CPRARequest|null>(null)
  const [tl,setTl]=useState<Timeline|null>(null)
  const recipients = ['clerk@example.com']

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>CPRA Response Planner (MVP)</h1>
      <div className='flex gap-2 text-sm'>
        {['Notes','Scope','Timeline','Letters','Tasks'].map((s,i)=>(
          <div key={i} className={'px-2 py-1 rounded ' + (i===step?'bg-blue-600 text-white':'bg-gray-100')}>{i+1}. {s}</div>
        ))}
      </div>
      {step===0 && <NotesUpload onExtract={(d)=>{setReq(d); setStep(1)}}/>}
      {step===1 && req && <ScopeForm draft={req} onApprove={(r)=>{ setReq(r); setStep(2) }}/>} 
      {step===2 && req && <TimelineView req={req} onApprove={(t)=>{ setTl(t); setStep(3) }}/>} 
      {step===3 && req && tl && <LettersEditor req={req} tl={tl} onAccept={()=>setStep(4)} />}
      {step===4 && tl && <TasksAndChecklist matterId={'demo-1'} tl={tl} recipients={recipients} />}
    </div>
  )
}
