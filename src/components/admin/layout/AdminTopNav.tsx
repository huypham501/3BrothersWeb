import Link from 'next/link';
import styled from 'styled-components';

export interface AdminNavItem {
  href: string;
  label: string;
}

interface AdminTopNavProps {
  items: AdminNavItem[];
  activeHref?: string;
}

export function AdminTopNav({ items, activeHref }: AdminTopNavProps) {
  return (
    <Nav>
      {items.map((item) => (
        <NavLink key={item.href} href={item.href} $active={activeHref === item.href}>
          {item.label}
        </NavLink>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#1e293b' : '#cbd5e1')};
  background: ${({ $active }) => ($active ? '#e2e8f0' : '#ffffff')};
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: #f8fafc;
  }
`;
