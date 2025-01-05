"use client";
import React, { useState } from "react";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

import {
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
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
  const [openNestedMenu, setopenNestedMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Typography
            as="div"
            variant="small"
            className="font-medium"
            {...defaultProps}
          >
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isToolsMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
              {...defaultProps}
            >
              Tools
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isToolsMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-xl lg:block" {...defaultProps}>
          <Menu
            placement="right-start"
            allowHover
            offset={15}
            open={openNestedMenu}
            handler={setopenNestedMenu}
          >
            <MenuHandler className="flex items-center justify-between">
              <Link href="/tools/passwordreset">
                <MenuItem {...defaultProps}>Reset Password Email</MenuItem>
              </Link>
            </MenuHandler>
          </Menu>
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
            <Typography
              as="div"
              variant="small"
              className="font-medium"
              {...defaultProps}
            >
              <ListItem
                className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
                selected={isFinanceMenuOpen}
                onClick={() => setIsMobileMenuOpen((cur) => !cur)}
                {...defaultProps}
              >
                Finance
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`hidden h-3 w-3 transition-transform lg:block ${
                    isFinanceMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </ListItem>
            </Typography>
          </MenuHandler>
          <MenuList className="hidden rounded-xl lg:block" {...defaultProps}>
            <Menu
              placement="right-start"
              allowHover
              offset={15}
              open={openNestedMenu}
              handler={setopenNestedMenu}
            >
              <MenuHandler className="flex items-center justify-between">
                <Link href="/finance/monthly-report">
                  <MenuItem {...defaultProps}>Monthly Report</MenuItem>
                </Link>
              </MenuHandler>
            </Menu>
          </MenuList>
        </Menu>
      )}
      <div className="block lg:hidden">
        <Menu
          placement="bottom"
          allowHover
          offset={6}
          open={openNestedMenu}
          handler={setopenNestedMenu}
        >
          <MenuItem {...defaultProps}>Tools</MenuItem>
          <MenuHandler className="flex items-center justify-between">
            <Link href="/tools/passwordreset">
              <MenuItem {...defaultProps} className="ml-5">
                Password Reset Email
              </MenuItem>
            </Link>
          </MenuHandler>
        </Menu>
        {user && userHasRole(user, roles.financeAdmin) && (
          <Menu
            placement="bottom"
            allowHover
            offset={6}
            open={openNestedMenu}
            handler={setopenNestedMenu}
          >
            <MenuItem {...defaultProps}>Finance</MenuItem>
            <MenuHandler className="flex items-center justify-between">
              <Link href="/finance/monthly-report">
                <MenuItem {...defaultProps} className="ml-5">
                  Monthly Report
                </MenuItem>
              </Link>
            </MenuHandler>
          </Menu>
        )}
      </div>
    </React.Fragment>
  );
}

function NavList({ user }: { user: UserProfile | undefined }) {
  return (
    <List
      className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1"
      {...defaultProps}
    >
      {user && (
        <React.Fragment>
          <Typography
            as="div"
            variant="small"
            className="font-medium"
            {...defaultProps}
          >
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              {...defaultProps}
            >
              Logged in as {user.name}
            </ListItem>
          </Typography>
          <NavListMenu />
        </React.Fragment>
      )}
    </List>
  );
}

export default function TopNavbar() {
  const { user, isLoading: userIsLoading } = useUser();
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2" {...defaultProps}>
      <div className="flex items-center justify-between text-blue-gray-900">
        <Link href="/">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
            {...defaultProps}
          >
            Shrimers Trust Tools
          </Typography>
        </Link>
        {user && (
          <div className="hidden lg:block">
            <NavList user={user} />
          </div>
        )}
        {!user && !userIsLoading && (
          <div className="hidden gap-2 lg:flex">
            <a href="/api/auth/login">
              <Button variant="outlined" size="sm" {...defaultProps}>
                Log In
              </Button>
            </a>
          </div>
        )}
        {user && (
          <div className="hidden gap-2 lg:flex">
            <a href="/api/auth/logout">
              <Button variant="outlined" size="sm" {...defaultProps}>
                Log Out
              </Button>
            </a>
          </div>
        )}
        <IconButton
          variant="text"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          {...defaultProps}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList user={user} />
        {!user && !userIsLoading && (
          <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
            <a href="/api/auth/login">
              <Button variant="outlined" size="sm" fullWidth {...defaultProps}>
                Log In
              </Button>
            </a>
          </div>
        )}
        {user && (
          <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
            <a href="/api/auth/logout">
              <Button variant="outlined" size="sm" fullWidth {...defaultProps}>
                Log Out
              </Button>
            </a>
          </div>
        )}
      </Collapse>
    </Navbar>
  );
}
