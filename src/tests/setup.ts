import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Worker since it's not available in JSDOM
class MockWorker {
  url: string | URL;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  constructor(stringUrl: string | URL) {
    this.url = stringUrl;
  }

  postMessage(data: any) {
    // Basic mock logic: immediately respond if needed, 
    // but usually we control this inside tests via vi.spyOn
  }

  terminate() {
    // Mock terminate
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
}

global.Worker = MockWorker as any;

// Mock URL.createObjectURL if needed
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();
