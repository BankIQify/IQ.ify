import { useEffect, useState } from 'react';
import { getPageDisplayName } from '../utils/dataInputAccess';

export default function usePageDisplayName(pageName: string) {
  const [displayName, setDisplayName] = useState(pageName);

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const name = await getPageDisplayName(pageName);
        setDisplayName(name);
      } catch (error) {
        console.error('Error fetching page display name:', error);
        setDisplayName(pageName);
      }
    };

    fetchDisplayName();
  }, [pageName]);

  return displayName;
}
