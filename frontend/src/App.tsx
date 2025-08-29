import React, { useEffect, useRef, useState } from 'react';
import Stepper from './components/Stepper';
import ContextPanel, { StepContext } from './components/ContextPanel';
import NotesUpload from './steps/NotesUpload';
import ScopeForm from './steps/ScopeForm';
import TimelineView from './steps/TimelineView';
import LettersEditor from './steps/LettersEditor';
import TasksAndChecklist from './steps/TasksAndChecklist';
import type { CPRARequest, Timeline } from './types';

/** Root application component orchestrating the workflow steps. */
export default function App() {
  const steps = ['Notes', 'Scope', 'Timeline', 'Letters', 'Tasks'];
  const contexts: StepContext[] = [
    {
      does: 'Upload attorney notes to start the demo.',
      ai: 'Parses notes to draft a request scope.',
      lawyer: 'Checks the extracted details.',
    },
    {
      does: 'Review and edit the extracted scope.',
      ai: 'Drafts request details from the notes.',
      lawyer: 'Edits fields or accepts as-is.',
    },
    {
      does: 'Confirm statutory timeline.',
      ai: 'Calculates deadlines based on the request.',
      lawyer: 'Approves the schedule.',
    },
    {
      does: 'Review draft acknowledgment or extension letters.',
      ai: 'Generates letter templates.',
      lawyer: 'Edits language or accepts the draft.',
    },
    {
      does: 'Track redaction tasks and create calendar holds.',
      ai: 'Suggests checklist items and events.',
      lawyer: 'Completes tasks and downloads calendar file.',
    },
  ];

  const SAMPLE_NOTES =
    'Public Records Act request by Jane Rivera <jrivera@example.com> on 2025-08-10. Records sought: emails and texts regarding agenda item 4.';

  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState('');
  const [req, setReq] = useState<CPRARequest | null>(null);
  const [tl, setTl] = useState<Timeline | null>(null);
  const nextRef = useRef<() => Promise<any> | any>(() => {});
  const [canNext, setCanNext] = useState(true);
  const startRef = useRef(Date.now());

  function registerNext(fn: () => Promise<any> | any, ready = true) {
    nextRef.current = fn;
    setCanNext(ready);
  }

  useEffect(() => {
    startRef.current = Date.now();
  }, [step]);

  async function handleNext() {
    if (!canNext) return;
    try {
      const result = await nextRef.current();
      let action: 'accept' | 'edit' = 'accept';
      switch (step) {
        case 0:
          setReq(result);
          action = notes === SAMPLE_NOTES ? 'accept' : 'edit';
          break;
        case 1:
          action = JSON.stringify(result) === JSON.stringify(req) ? 'accept' : 'edit';
          setReq(result);
          break;
        case 2:
          setTl(result);
          action = 'accept';
          break;
        case 3:
          action = result.edited ? 'edit' : 'accept';
          break;
      }
      const ms = Date.now() - startRef.current;
      console.log(`Step ${steps[step]}: ${action} in ${ms}ms`);
      setStep(s => s + 1);
    } catch (e) {
      console.error(e);
    }
  }

  function handleBack() {
    if (step === 0) return;
    setStep(s => s - 1);
  }

  function resetDemo() {
    setNotes('');
    setReq(null);
    setTl(null);
    setStep(0);
  }

  function loadSample() {
    setNotes(SAMPLE_NOTES);
  }

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <header className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>CPRA Response Planner (MVP)</h1>
        <div className='space-x-2 text-sm'>
          <button className='btn' onClick={resetDemo}>Reset demo</button>
          <button className='btn' onClick={loadSample}>Load sample notes</button>
        </div>
      </header>
      <div className='flex gap-6'>
        <div className='flex-1'>
          {step === 0 && (
            <NotesUpload notes={notes} setNotes={setNotes} registerNext={registerNext} />
          )}
          {step === 1 && req && <ScopeForm draft={req} registerNext={registerNext} />}
          {step === 2 && req && <TimelineView req={req} registerNext={registerNext} />}
          {step === 3 && req && tl && (
            <LettersEditor req={req} tl={tl} registerNext={registerNext} />
          )}
          {step === 4 && tl && (
            <TasksAndChecklist
              matterId={'demo-1'}
              tl={tl}
              recipients={['clerk@example.com']}
            />
          )}
        </div>
        <aside className='w-64'>
          <ContextPanel context={contexts[step]} />
        </aside>
      </div>
      <footer className='sticky bottom-0 bg-white border-t mt-4 py-3'>
        <Stepper
          current={step}
          labels={steps}
          onBack={handleBack}
          onNext={handleNext}
          disableBack={step === 0}
          disableNext={!canNext || step === steps.length - 1}
        />
      </footer>
    </div>
  );
}
