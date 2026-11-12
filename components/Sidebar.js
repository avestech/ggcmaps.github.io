'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAllBuildings } from '../lib/campus';
import { RESTRICTED_BUILDING_IDS, RESTRICTED_HOVER_SELECTORS } from '../lib/constants';
import { clearHoverEvents, createHoverHandlers } from '../lib/eventSystem';
import { useLanguage } from './LanguageContext';
import { getUIText, translateBuildingName } from '../lib/i18n';

// Get building data and create navigation items
const buildings = getAllBuildings();

const buildHoverDetail = (building) => {
  const selector = RESTRICTED_HOVER_SELECTORS[building.id];
  if (selector) {
    return { selector };
  }
  const hoverId = typeof building.id === 'string' ? building.id.toLowerCase() : String(building.id).toLowerCase();
  return { ids: [hoverId] };
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = String(usePathname() ?? '');
  const { locale } = useLanguage();
  const copy = getUIText(locale);

  const navItems = useMemo(() => {
    const campusItem = {
      key: 'campus',
      label: copy.sidebar.campusLabel,
      path: '/',
      hover: { selector: '.building-group' },
    };

    const buildingItems = buildings
      .slice()
      .filter((b) => !RESTRICTED_BUILDING_IDS.includes(b.id))
      .map((building) => ({
        key: building.id,
        label: translateBuildingName(building.name, locale),
        path: `/building/${building.id}`,
        hover: buildHoverDetail(building),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, locale === 'es' ? 'es' : 'en', { sensitivity: 'base' }));

    return [campusItem, ...buildingItems];
  }, [locale, copy.sidebar.campusLabel]);

  const handleCollapse = () => {
    clearHoverEvents('sidebar:collapse');
    setCollapsed(true);
  };

  const handleExpand = () => setCollapsed(false);

  const createHandlers = (item) => 
    createHoverHandlers(`sidebar:${item.key}`, item.hover);

  return (
    <div className={`sidebar-slot${collapsed ? ' is-collapsed' : ''}`}>
      {!collapsed ? (
        <nav className="sidebar" aria-label={copy.sidebar.navAria}>
          <div className="sidebar-header">
            
          </div>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const handlers = createHandlers(item);
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const linkClass = `nav-link${isActive ? ' active' : ''}`;
              return (
                <li key={item.key} className="nav-item">
                  <Link
                    className={linkClass}
                    href={item.path}
                    {...handlers}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <div className="sidebar-toggle-wrap">
        </div>
      )}
    </div>
  );
};
