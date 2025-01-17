export interface MobileNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}