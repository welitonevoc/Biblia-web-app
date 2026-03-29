/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useThemePersistence() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    // Apply theme to html element
    document.documentElement.setAttribute('data-theme', theme.mode);
    
    // Apply CSS variables for reader
    document.documentElement.style.setProperty('--reader-size', `${theme.fontSize}px`);
    document.documentElement.style.setProperty('--reader-lh', `${theme.lineHeight}`);
    document.documentElement.style.setProperty('--reader-margin', `${theme.horizontalMargin}px`);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      metaThemeColor.setAttribute('content', bgColor);
    }
  }, [theme]);
}

export function initializeTheme() {
  const settings = JSON.parse(localStorage.getItem('yv-settings') || '{}');
  const theme = settings.state?.theme;
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme.mode);
  }
}
