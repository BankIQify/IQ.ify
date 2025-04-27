declare module '@/components/layout/Navigation' {
  import { ReactNode } from 'react';
  export interface NavigationProps {
    isDataInput: boolean;
    isAdmin: boolean;
  }
  export const Navigation: React.FC<NavigationProps>;
}

declare module '@/components/layout/MainContent' {
  import { ReactNode } from 'react';
  export interface MainContentProps {
    children: ReactNode;
  }
  export const MainContent: React.FC<MainContentProps>;
}

declare module '@/components/layout/Header' {
  import { ReactNode } from 'react';
  export interface HeaderProps {
    user: any; // TODO: Properly type the user object
  }
  export const Header: React.FC<HeaderProps>;
}

declare module '@/components/layout/Footer' {
  import { ReactNode } from 'react';
  export const Footer: React.FC;
}
