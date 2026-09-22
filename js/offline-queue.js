/**
 * Headless Offline Lead Queue & Auto-Replay Engine
 * Goyal My Home Sanctuary, Mamurdi, PCMC
 * 
 * Guarantees zero lost leads during expressway network drops.
 * Uses browser IndexedDB to buffer lead telemetry offline and
 * automatically drains to /api/lead-capture upon network restoration.
 * Zero UI/UX modification invariant strictly preserved.
 */

(function () {
  'use strict';

  var DB_NAME = 'SanctuaryOfflineDB';
  var DB_VERSION = 1;
  var STORE_NAME = 'lead_queue';

  function openDatabase(callback) {
    if (typeof indexedDB === 'undefined') {
      return callback(null);
    }
    try {
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = function (e) {
        callback(e.target.result);
      };
      request.onerror = function () {
        callback(null);
      };
    } catch (err) {
      callback(null);
    }
  }

  function drainQueue() {
    if (!navigator.onLine) return;

    openDatabase(function (db) {
      if (!db) return;
      try {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var getAllReq = store.getAll();

        getAllReq.onsuccess = function () {
          var items = getAllReq.result || [];
          if (items.length === 0) return;

          items.forEach(function (item) {
            fetch('/api/lead-capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.payload)
            }).then(function (res) {
              if (res.ok) {
                openDatabase(function (db2) {
                  if (!db2) return;
                  var tx2 = db2.transaction(STORE_NAME, 'readwrite');
                  tx2.objectStore(STORE_NAME).delete(item.id);
                });
              }
            }).catch(function () {
              // Retain in queue for next drain retry
            });
          });
        };
      } catch (e) {
        // Fail silently
      }
    });
  }

  // Network restoration triggers
  if (typeof window !== 'undefined') {
    window.addEventListener('online', drainQueue);
    window.addEventListener('load', function () {
      setTimeout(drainQueue, 2000);
    });
  }

  window.SanctuaryOfflineQueue = {
    enqueue: function (payload) {
      payload = payload || {};
      payload.queuedAt = new Date().toISOString();

      openDatabase(function (db) {
        if (!db) {
          // Fallback to beacon immediately if IndexedDB unavailable
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/lead-capture', JSON.stringify(payload));
          }
          return;
        }
        try {
          var tx = db.transaction(STORE_NAME, 'readwrite');
          var store = tx.objectStore(STORE_NAME);
          store.add({ payload: payload, timestamp: Date.now() });
          tx.oncomplete = function () {
            if (navigator.onLine) {
              drainQueue();
            }
          };
        } catch (e) {
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/lead-capture', JSON.stringify(payload));
          }
        }
      });
    },
    drain: drainQueue,
    getPendingCount: function (callback) {
      openDatabase(function (db) {
        if (!db) return callback(0);
        try {
          var tx = db.transaction(STORE_NAME, 'readonly');
          var countReq = tx.objectStore(STORE_NAME).count();
          countReq.onsuccess = function () {
            callback(countReq.result || 0);
          };
          countReq.onerror = function () {
            callback(0);
          };
        } catch (e) {
          callback(0);
        }
      });
    }
  };
})();
