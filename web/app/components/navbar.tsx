"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

import {
  Collapse,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { annoyingDefaultProps as defaultProps } from "@/src/utils";
import { roles, userHasRole } from "@/src/roles";

function NavListMenu() {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isFinanceMenuOpen, setIsFinanceMenuOpen] = useState(false);

  const { user } = useUser();

  return (
    <React.Fragment>
      <Menu
        open={isToolsMenuOpen}
        handler={setIsToolsMenuOpen}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler className="hidden lg:block">
          <button className="flex items-center gap-2 px-4 py-2 text-gold-400 hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200 rounded-md font-medium">
            Tools
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-4 w-4 transition-transform duration-200 ${
                isToolsMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </MenuHandler>
        <MenuList className="hidden lg:block bg-primary-900 border border-gold-400/20 shadow-lg" {...defaultProps}>
          <Link href="/tools/passwordreset">
            <MenuItem className="text-gold-400 hover:bg-primary-800 hover:text-gold-300 font-medium" {...defaultProps}>
              Reset Password Email
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
      {user && userHasRole(user, roles.financeAdmin) && (
        <Menu
          open={isFinanceMenuOpen}
          handler={setIsFinanceMenuOpen}
          placement="bottom"
          allowHover={true}
        >
          <MenuHandler className="hidden lg:block">
            <button className="flex items-center gap-2 px-4 py-2 text-gold-400 hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200 rounded-md font-medium">
              Finance
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`h-4 w-4 transition-transform duration-200 ${
                  isFinanceMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </MenuHandler>
          <MenuList className="hidden lg:block bg-primary-900 border border-gold-400/20 shadow-lg" {...defaultProps}>
            <Link href="/finance/monthly-report">
              <MenuItem className="text-gold-400 hover:bg-primary-800 hover:text-gold-300 font-medium" {...defaultProps}>
                Monthly Report
              </MenuItem>
            </Link>
          </MenuList>
        </Menu>
      )}
    </React.Fragment>
  );
}

function NavList({ user }: { user: ReturnType<typeof useUser>['user'] }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
      {user && (
        <React.Fragment>
          <div className="px-4 py-2 text-white/80 font-medium text-sm lg:hidden">
            Logged in as {user.name}
          </div>
          <NavListMenu />
        </React.Fragment>
      )}
    </div>
  );
}

function MobileNavMenu() {
  const { user } = useUser();

  return (
    <div className="lg:hidden space-y-2 px-4 py-4">
      {user && (
        <React.Fragment>
          <div className="text-gold-400/80 text-sm font-medium mb-4">
            Logged in as {user.name}
          </div>

          <div className="space-y-1">
            <div className="text-gold-400 font-medium text-lg mb-2">Tools</div>
            <Link href="/tools/passwordreset">
              <div className="text-gold-400/90 hover:text-gold-300 hover:bg-primary-800 px-3 py-2 rounded-md transition-colors duration-200">
                Reset Password Email
              </div>
            </Link>
          </div>

          {userHasRole(user, roles.financeAdmin) && (
            <div className="space-y-1 mt-4">
              <div className="text-gold-400 font-medium text-lg mb-2">Finance</div>
              <Link href="/finance/monthly-report">
                <div className="text-gold-400/90 hover:text-gold-300 hover:bg-primary-800 px-3 py-2 rounded-md transition-colors duration-200">
                  Monthly Report
                </div>
              </Link>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default function TopNavbar() {
  const { user, isLoading: userIsLoading } = useUser();
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1024 && setOpenNav(false),
    );
  }, []);

  return (
    <nav className="bg-primary-900 border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-gold-400 text-xl font-bold">
              Shrimpers Trust Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {user && <NavList user={user} />}

            {/* User Info and Auth Buttons */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gold-400/20">
              {user && (
                <span className="text-gold-400/80 text-sm font-medium">
                  {user.name}
                </span>
              )}

              {!user && !userIsLoading && (
                <a href="/auth/login">
                  <button className="bg-gold-400 text-primary-900 px-4 py-2 rounded-md font-medium hover:bg-gold-300 transition-colors duration-200">
                    Log In
                  </button>
                </a>
              )}

              {user && (
                <a href="/auth/logout">
                  <button className="border border-gold-400/40 text-gold-400 px-4 py-2 rounded-md font-medium hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200">
                    Log Out
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gold-400 hover:bg-primary-800 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-400"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <Collapse open={openNav}>
          <div className="lg:hidden border-t border-gold-400/20">
            <MobileNavMenu />

            {/* Mobile Auth Buttons */}
            <div className="px-4 py-4 border-t border-gold-400/20">
              {!user && !userIsLoading && (
                <a href="/auth/login">
                  <button className="w-full bg-gold-400 text-primary-900 px-4 py-3 rounded-md font-medium hover:bg-gold-300 transition-colors duration-200">
                    Log In
                  </button>
                </a>
              )}

              {user && (
                <a href="/auth/logout">
                  <button className="w-full border border-gold-400/40 text-gold-400 px-4 py-3 rounded-md font-medium hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200">
                    Log Out
                  </button>
                </a>
              )}
            </div>
          </div>
        </Collapse>
      </div>
    </nav>
  );
}
