import { useEffect } from 'react';
import { startActivityTracking, stopActivityTracking } from '../../utils/activityTracker';

/**
 * Component that initializes activity tracking for automatic logout
 * This should be mounted in all author pages
 */
export default function ActivityTracker() {
  useEffect(() => {
    // Start activity tracking when component mounts
    startActivityTracking();
    
    // Cleanup: stop tracking when component unmounts
    return () => {
      stopActivityTracking();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
