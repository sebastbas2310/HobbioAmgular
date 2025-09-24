import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    displayName: 'Workers',
    iconName: 'layout-grid-add',
    route: '/workers',
  },
  {
    displayName: 'Menu',
    iconName: 'people',
    route: '/menu',
  },
  {
    displayName: 'ingredientes',
    iconName: 'people',
    route: '/ingredients',
  },
  {
    displayName: 'Tables',
    iconName: 'people',
    route: '/tables',
  },
]