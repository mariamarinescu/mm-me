import { ThemeAwareTooltip } from 'components/ThemeAwareTooltip';
import { ToggleButton } from 'components/buttons';
import { useEffect, useState } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { useRecoilState } from 'recoil';
import darkThemeAtom from 'src/store/darkTheme/atom';

interface ThemeButtonProps {
  isMobile?: boolean;
}

export const ChangeThemeButton: React.FC<ThemeButtonProps> = () => {
  const [isDarkActive, setIsDarkActive] = useState(false);
  const [darkThemeStatus, setDarkThemeStatusInStore] =
    useRecoilState(darkThemeAtom);

  useEffect(() => {
    if (darkThemeStatus !== isDarkActive)
      setDarkThemeStatusInStore(isDarkActive);
  }, [isDarkActive]);

  const toggleDarkMode = () => {
    setIsDarkActive((prevState) => !prevState);
    document.body.classList.toggle('dark');
  };

  return (
    <>
      <div
        className="flex h-fit w-fit"
        data-tooltip-content={`Switch ${!!darkThemeStatus ? 'light' : 'dark'} theme`}
        data-tooltip-id="theme-switch-button"
      >
        <ToggleButton
          activeIcon={<IoMdSunny style={{ fontSize: '20px' }} />}
          inactiveIcon={
            <IoMdMoon style={{ fontSize: '20px' }} className="text-gray-800" />
          }
          activeBgColor="bg-gray-dark"
          inactiveBgColor="hover:bg-gray-medium"
          className="right-4 top-4 border border-neon-purple"
          label="Toggle dark mode"
          onChange={toggleDarkMode}
          size="md"
        />
      </div>
      <ThemeAwareTooltip id="theme-switch-button" />
    </>
  );
};