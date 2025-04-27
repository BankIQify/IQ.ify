import type { Profile } from '@/types/auth/types';

/**
 * Returns true if the given profile belongs to a Data Input user.
 */
export function isDataInputUser(profile: Profile | null): boolean {
  return profile?.role === 'data_input';
}

/**
 * Determines whether a Data Input user is allowed to access a specific page.
 * @param profile - The current user's profile
 * @param pageName - The internal page identifier
 * @param allowedPages - A list of page names the Data Input team can access
 */
export function isPageAllowed(
  profile: Profile | null,
  pageName: string,
  allowedPages: string[]
): boolean {
  if (!isDataInputUser(profile)) {
    return false;
  }
  return allowedPages.includes(pageName);
}

/**
 * Maps internal page names to display names for Data Input users.
 * Falls back to the original name if no custom label is defined or the user is not a Data Input user.
 */
export function getPageDisplayName(
  profile: Profile | null,
  pageName: string
): string {
  if (!isDataInputUser(profile)) {
    return pageName;
  }
  switch (pageName) {
    case 'AI Webhooks':
      return 'Question Editor';
    default:
      return pageName;
  }
}
