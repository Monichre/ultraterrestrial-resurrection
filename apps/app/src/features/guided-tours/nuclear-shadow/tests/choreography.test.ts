import { describe, expect, it } from 'vitest';
import { wait } from '../../shared/choreography/transition-sequence';

describe('transition cancellation', () => {
  it('rejects an aborted transition wait', async () => {
    const controller = new AbortController();
    const pending = wait(1000, controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });
});
