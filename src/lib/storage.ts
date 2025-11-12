export function setItem(key: string, data: any, session?: boolean): void {
  if (typeof window !== 'undefined' && data) {
    const storageType = session ? 'sessionStorage' : 'localStorage';
    const isInIframe = window.self !== window.top;

    console.log(`[storage.ts] setItem called:`, {
      key,
      storageType,
      isInIframe,
      dataType: typeof data,
      dataPreview: JSON.stringify(data).substring(0, 50),
    });

    try {
      (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(data));
      console.log(`[storage.ts] ✓ setItem succeeded for key: ${key}`);
    } catch (error) {
      console.error(`[storage.ts] ✗ setItem FAILED for key: ${key}`, {
        error,
        errorName: error?.name,
        errorMessage: error?.message,
        isInIframe,
        storageType,
      });
      throw error; // Re-throw to propagate the error
    }
  } else {
    console.log(`[storage.ts] setItem skipped:`, {
      key,
      windowUndefined: typeof window === 'undefined',
      dataUndefined: !data,
    });
  }
}

export function getItem(key: string, session?: boolean): any {
  if (typeof window !== 'undefined') {
    const storageType = session ? 'sessionStorage' : 'localStorage';
    const isInIframe = window.self !== window.top;

    console.log(`[storage.ts] getItem called:`, {
      key,
      storageType,
      isInIframe,
    });

    try {
      const value = (session ? sessionStorage : localStorage).getItem(key);

      if (value !== 'undefined' && value !== null) {
        try {
          const parsed = JSON.parse(value);
          console.log(`[storage.ts] ✓ getItem succeeded for key: ${key}`, {
            valuePreview: value.substring(0, 50),
          });
          return parsed;
        } catch (error) {
          console.error(`[storage.ts] ✗ getItem JSON.parse failed for key: ${key}`, error);
          return null;
        }
      } else {
        console.log(`[storage.ts] getItem found no value for key: ${key}`, { value });
        return undefined;
      }
    } catch (error) {
      console.error(`[storage.ts] ✗ getItem FAILED for key: ${key}`, {
        error,
        errorName: error?.name,
        errorMessage: error?.message,
        isInIframe,
      });
      return undefined;
    }
  }
  console.log(`[storage.ts] getItem skipped (window undefined) for key: ${key}`);
}

export function removeItem(key: string, session?: boolean): void {
  if (typeof window !== 'undefined') {
    return (session ? sessionStorage : localStorage).removeItem(key);
  }
}
