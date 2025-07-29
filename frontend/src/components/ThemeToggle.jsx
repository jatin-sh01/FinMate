import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { setThemeMode } from "../features/theme/themeSlice";

// Icons for theme modes
const SunIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
);

const MoonIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const ThemeToggle = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { mode, theme } = useSelector((state) => state.theme);

  const handleThemeChange = (selectedMode) => {
    dispatch(setThemeMode(selectedMode));
  };

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <SunIcon className="w-4 h-4" />;
      case "dark":
        return <MoonIcon className="w-4 h-4" />;
      default:
        return <SunIcon className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "Light";
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          size="sm"
          className={`min-w-unit-16 ${className}`}
          startContent={getIcon()}
        >
          <span className="hidden sm:inline">{getLabel()}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[mode]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedMode = Array.from(keys)[0];
          handleThemeChange(selectedMode);
        }}
      >
        <DropdownItem
          key="light"
          startContent={<SunIcon className="w-4 h-4" />}
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          startContent={<MoonIcon className="w-4 h-4" />}
        >
          Dark
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ThemeToggle;
