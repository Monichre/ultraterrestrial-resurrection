import {RedactedText} from './RedactedText'
import type {HeaderSpec, RedactedSpec} from '../types/paper-document'

function isBigNumber(right: HeaderSpec['right']): right is {bigNumber: string; sub?: RedactedSpec} {
  return typeof right === 'object' && right !== null && 'bigNumber' in right
}

/**
 * DocHeader — top registration row: left redacted code cluster, optional
 * centered bracket segment, and right code block or a large stamped number.
 */
export function DocHeader({spec}: {spec: HeaderSpec}) {
  return (
    <div
      className='pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-[6.2%] pt-[6%]'
      style={{zIndex: 30}}>
      <RedactedText spec={spec.left} />

      {spec.centerBracket && (
        <div
          aria-hidden='true'
          className='mt-1 flex items-center gap-2'
          style={{color: 'var(--pd-ink)'}}>
          <span style={{width: 10, height: 10, background: 'currentColor'}} />
          <span style={{width: 34, height: 1, background: 'currentColor'}} />
          <span style={{width: 10, height: 10, background: 'currentColor'}} />
        </div>
      )}

      {isBigNumber(spec.right) ? (
        <div className='text-right'>
          <div
            aria-hidden='true'
            className='font-mono font-black leading-none'
            style={{fontSize: 34, letterSpacing: '0.02em', color: 'var(--pd-ink)'}}>
            {spec.right.bigNumber}
          </div>
          {spec.right.sub && <RedactedText spec={spec.right.sub} align='right' className='mt-1' />}
        </div>
      ) : (
        <RedactedText spec={spec.right} align='right' />
      )}
    </div>
  )
}
