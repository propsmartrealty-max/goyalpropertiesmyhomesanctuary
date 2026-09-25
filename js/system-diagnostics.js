/**
 * Headless System Diagnostics & Client Readiness Suite
 * Path: js/system-diagnostics.js
 * 
 * Asserts client browser capabilities, modern image formats,
 * storage quotas, and network conditions for zero-UI telemetry.
 */

(function () {
  'use strict';

  class SystemDiagnostics {
    constructor() {
      this.capabilities = {
        webp: false,
        avif: false,
        serviceWorker: false,
        cacheStorage: false,
        localStorage: false,
        webPush: false,
        networkType: '4g',
        saveData: false,
        deviceCores: 4,
        deviceMemoryGb: 4
      };
      this.initialized = false;
      this.init();
    }

    async init() {
      if (typeof window === 'undefined') return;

      // 1. Service Worker & Cache
      this.capabilities.serviceWorker = 'serviceWorker' in navigator;
      this.capabilities.cacheStorage = 'caches' in window;

      // 2. LocalStorage test
      try {
        const testKey = '__diag_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        this.capabilities.localStorage = true;
      } catch (e) {
        this.capabilities.localStorage = false;
      }

      // 3. Web Push API
      this.capabilities.webPush = 'PushManager' in window && 'Notification' in window;

      // 4. Network Info
      if ('connection' in navigator) {
        const conn = navigator.connection;
        this.capabilities.networkType = conn.effectiveType || '4g';
        this.capabilities.saveData = conn.saveData || false;
      }

      // 5. Hardware hints
      if ('hardwareConcurrency' in navigator) {
        this.capabilities.deviceCores = navigator.hardwareConcurrency;
      }
      if ('deviceMemory' in navigator) {
        this.capabilities.deviceMemoryGb = navigator.deviceMemory;
      }

      // 6. Modern image codecs (WebP / AVIF)
      this.capabilities.webp = await this._testImageFormat(
        'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
      );
      this.capabilities.avif = await this._testImageFormat(
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAacGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHB4bGkAAAAAAAEAAAAAEWF2MUOBAAAAAAAAFW1kYXQSAAoIP8R//hA='
      );

      this.initialized = true;
      window.dispatchEvent(new CustomEvent('sanctuary:diagnostics_ready', { detail: this.capabilities }));
    }

    _testImageFormat(dataUri) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.width > 0 && img.height > 0);
        img.onerror = () => resolve(false);
        img.src = dataUri;
      });
    }

    getDiagnostics() {
      return {
        timestamp: new Date().toISOString(),
        site: "Goyal My Home Sanctuary",
        capabilities: this.capabilities,
        optimalImageFormat: this.capabilities.avif ? 'avif' : (this.capabilities.webp ? 'webp' : 'jpg'),
        isHighPerformanceDevice: this.capabilities.deviceCores >= 4 && !this.capabilities.saveData
      };
    }
  }

  if (typeof window !== 'undefined') {
    window.SanctuaryDiagnostics = new SystemDiagnostics();
  }
})();
