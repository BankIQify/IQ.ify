import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isDataInputUser, isPageAllowed, getPageDisplayName } from '../dataInputAccess';
import { mockAuth, mockFrom } from './__mocks__/supabase';

describe('Data Input Access Utilities', () => {
  beforeEach(() => {
    // Reset the mock functions before each test
    mockAuth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } }
    });
    
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn().mockImplementation((callback) => callback({
            data: [{ page_name: 'manual-upload' }]
          }))
        })
      })
    });
  });

  describe('isDataInputUser', () => {
    it('should return true for data input user', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: { email: 'datateam.iqify@gmail.com' } }
      });
      expect(await isDataInputUser()).toBe(true);
    });

    it('should return false for non-data input user', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: { email: 'other@example.com' } }
      });
      expect(await isDataInputUser()).toBe(false);
    });
  });

  describe('isPageAllowed', () => {
    it('should return true for allowed pages', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: { email: 'datateam.iqify@gmail.com' } }
      });
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            then: vi.fn().mockImplementation((callback) => callback({
              data: [{ page_name: 'manual-upload' }]
            }))
          })
        })
      });
      expect(await isPageAllowed('manual-upload')).toBe(true);
    });

    it('should return false for non-data input user', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: { email: 'other@example.com' } }
      });
      expect(await isPageAllowed('manual-upload')).toBe(false);
    });
  });

  describe('getPageDisplayName', () => {
    it('should return Dashboard for data-input page', async () => {
      expect(await getPageDisplayName('data-input')).toBe('Dashboard');
    });

    it('should return Manual Upload for manual-upload page', async () => {
      expect(await getPageDisplayName('manual-upload')).toBe('Manual Upload');
    });

    it('should return Question Editor for webhook page', async () => {
      expect(await getPageDisplayName('webhook')).toBe('Question Editor');
    });

    it('should return webhook as fallback for unknown webhook pages', async () => {
      expect(await getPageDisplayName('webhook')).toBe('webhook');
    });
  });
});
