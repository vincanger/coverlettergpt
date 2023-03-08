import { useEffect } from 'react';
import shareIncrementer from '@wasp/actions/shareIncrementer';

// http://localhost:3000/?jobId=1&share=1

export const useClickTracker = () => {
  useEffect(() => {
    async function handleShareLinkClick(jobId: number) {
      const clicked = await shareIncrementer({ jobId });
      console.log('shareIncrementer called', clicked)
    }

    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    const jobId = urlParams.get('jobId');
    console.log('shareParam', shareParam)
    console.log('jobId', jobId, typeof jobId)

    if (shareParam && jobId) {
      handleShareLinkClick(Number(jobId));
    }
  }, []);
};
