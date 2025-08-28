import React from 'react';

/** Display a labeled value in a styled card. */
export default function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className='card'>
      <div className='text-sm text-gray-600'>{title}</div>
      <div className='text-lg font-semibold'>{value}</div>
    </div>
  );
}

