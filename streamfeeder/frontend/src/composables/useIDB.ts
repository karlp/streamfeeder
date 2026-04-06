import { openDB } from 'idb';
import type { DBSchema } from 'idb';

export interface SFDB extends DBSchema {
  'streamitem': {
    key: string;
    value: {
      basename: string;
      dataOriginal: Buffer;
      thumbnail1?: Buffer; // we probably want all sorts of thumbnails right? by size or something?
      // what else? do we put the thumbnails here too? probably?
    }
  }
}

const DB_NAME = 'StreamFeederStore';

// export function useIDB() {
//   const dbPromise = openDB<SFDB>(DB_NAME, 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains('streamitem')) {
//         db.createObjectStore('streamitem');
//       }
//     },
//   });

//   const setItem = async (key, value) => {
//     const db = await dbPromise;
//     return db.put('streamitem', value, key);
//   };

//   const getItem = async (key) => {
//     const db = await dbPromise;
//     return db.get('streamitem', key);
//   };

//   return { setItem, getItem };
// }

export function useIDB() {
  async function getDB() {
    return await openDB<SFDB>(DB_NAME, 2, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log("ok, we got the upðgrade call...", oldVersion, newVersion);
        db.createObjectStore('streamitem');
      },
      terminated() {
        console.log("got the terminated call");
      },
      blocked(currentVersion, blockedVersion, event) {
        console.warn("blocked", currentVersion, blockedVersion, event);
      },
      blocking(currentVersion, blockedVersion, event) {
        console.warn("blockinggg", currentVersion, blockedVersion, event);
      },
    });
  }
 

  async function getItem(key) {
    const lol = await getDB();
    console.log("ok, the db is up now", lol)
    return lol.get('streamitem', key);
    //return (await dbPromise).get('streamitem', key);
  }
  async function setItem(key, val) {
    const lol = await getDB();
    return lol.put('streamitem', val, key);
  }

  return { setItem, getItem };

}

