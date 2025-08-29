import React from 'react';

/** Display step progress with back/next navigation in a sticky footer. */
export default function Stepper({
  current,
  labels,
  onBack,
  onNext,
  disableBack,
  disableNext,
}: {
  current: number;
  labels: string[];
  onBack: () => void;
  onNext: () => void;
  disableBack?: boolean;
  disableNext?: boolean;
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm'>{`${current + 1}/${labels.length} ${labels[current]}`}</div>
      <div className='space-x-2'>
        <button className='btn' onClick={onBack} disabled={disableBack}>
          Back
        </button>
        <button className='btn-primary' onClick={onNext} disabled={disableNext}>
          Next
        </button>
      </div>
    </div>
  );
}
