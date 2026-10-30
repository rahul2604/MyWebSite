import { useEffect, useState } from 'react';
import { api } from './api';

/*
 * Whether the PMP® course is open to the public (server setting PMP_COURSE_LAUNCHED), asked
 * once per page load. null while the answer is on its way. If the server cannot be reached the
 * course is treated as not launched. This only chooses what to show: the server enforces access.
 */
let pending: Promise<boolean> | null = null;
const fetchLaunched = () => (pending ??= api.status().then((s) => s.launched === true, () => false));

export function useCourseLaunched(): boolean | null {
  const [launched, setLaunched] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    void fetchLaunched().then((v) => {
      if (live) setLaunched(v);
    });
    return () => {
      live = false;
    };
  }, []);
  return launched;
}
