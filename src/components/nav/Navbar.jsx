'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ userId, role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const router = useRouter();

  function closeMenu() {
    setMenuOpen(false);
    setProfileOpen(false);
    setAdminOpen(false);
  }

  function handleNavClick(href) {
    closeMenu();
    router.push(href);
  }

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-red-700 dark:bg-red-900 flex items-center justify-between px-4 shadow-md">
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-2 text-white font-bold text-lg tracking-tight select-none"
        >
          <span aria-hidden="true">🎅</span>
          <span>Sinterklaas</span>
        </Link>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col gap-1.5 p-2 rounded-md text-white hover:bg-red-600 active:bg-red-800 transition-colors"
        >
          <span className="block h-0.5 w-6 bg-white rounded-full" />
          <span className="block h-0.5 w-6 bg-white rounded-full" />
          <span className="block h-0.5 w-6 bg-white rounded-full" />
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Slide-out panel */}
      <nav
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Navigation menu"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-700 dark:bg-red-900">
          <span className="text-white font-semibold text-base">Menu</span>
          <button
            aria-label="Close menu"
            onClick={closeMenu}
            className="text-white hover:text-red-200 text-xl leading-none font-bold"
          >
            &times;
          </button>
        </div>

        {/* Nav items */}
        <ul className="flex-1 overflow-y-auto py-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => handleNavClick('/dashboard')}
              className="w-full text-left px-5 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-800 font-medium transition-colors"
            >
              Dashboard
            </button>
          </li>

          {/* Profile accordion */}
          <li>
            <button
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="w-full flex items-center justify-between px-5 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-800 font-medium transition-colors"
            >
              <span>Profile</span>
              <span
                className={`text-xs text-zinc-400 transform transition-transform duration-200 ${
                  profileOpen ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            {profileOpen && (
              <ul className="border-l-2 border-amber-400 ml-5">
                <li>
                  <button
                    onClick={() => handleNavClick('/profile/edit')}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Update Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/profile/partner')}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Partner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/profile/children')}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Add Children
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Admin accordion — only for admins */}
          {role === 'admin' && (
            <li>
              <button
                onClick={() => setAdminOpen((open) => !open)}
                aria-expanded={adminOpen}
                className="w-full flex items-center justify-between px-5 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-800 font-medium transition-colors"
              >
                <span>Admin</span>
                <span
                  className={`text-xs text-zinc-400 transform transition-transform duration-200 ${
                    adminOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
              {adminOpen && (
                <ul className="border-l-2 border-red-400 ml-5">
                  <li>
                    <button
                      onClick={() => handleNavClick('/admin/invite')}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Invite Users
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavClick('/admin/members')}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Delete Users
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavClick('/admin/draw')}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Name Drawing
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        {/* Footer identity hint */}
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-400 truncate">User: {userId}</p>
        </div>
      </nav>
    </>
  );
}
