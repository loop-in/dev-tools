import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegexTesterTool } from '@/components/tools/RegexTesterTool';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock WebWorker behavior for component testing
class MockWorker {
  onmessage: ((e: any) => void) | null = null;
  postMessage = vi.fn((data: any) => {
    const { pattern, flags, testString } = data;
    // Simulate worker responding after a short delay
    setTimeout(() => {
      if (!this.onmessage) return;

      if (pattern === 'INVALID(') {
        this.onmessage({ data: { matches: [], error: 'Invalid regular expression' } });
      } else if (pattern === 'RE-DOS') {
        this.onmessage({ data: { matches: [], error: 'Regex execution timed out' } });
      } else if (pattern === 'apple' && testString === 'banana') {
        this.onmessage({ data: { matches: [], error: null } });
      } else if (pattern === 'apple' && flags.includes('i')) {
        this.onmessage({ 
          data: { 
            matches: [{ '0': 'Apple', index: 0, length: 5 }], 
            error: null 
          } 
        });
      } else if (pattern === 'test' && flags.includes('g') && testString === 'test test') {
        this.onmessage({ 
          data: { 
            matches: [
              { '0': 'test', index: 0, length: 4 },
              { '0': 'test', index: 5, length: 4 }
            ], 
            error: null 
          } 
        });
      } else {
        this.onmessage({ 
          data: { 
            matches: [{ '0': 'test', index: 0, length: 4 }], 
            error: null 
          } 
        });
      }
    }, 10);
  });
  terminate = vi.fn();
}

// Override the global MockWorker from setup.ts specifically for this test's response logic
global.Worker = vi.fn(function() {
  return new MockWorker();
}) as any;

describe('RegexTesterTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    render(<RegexTesterTool />);
    expect(screen.getByPlaceholderText(/your pattern here/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter text to test against your pattern/i)).toBeInTheDocument();
  });

  it('updates result when valid regex matches', async () => {
    render(<RegexTesterTool />);
    
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'test string' } });

    // Wait for the mock worker to respond
    await waitFor(() => {
      expect(screen.getByText('1 match')).toBeInTheDocument();
    });
    
    expect(screen.getByText('index 0')).toBeInTheDocument();
  });

  it('does not show result if pattern is empty', async () => {
    render(<RegexTesterTool />);
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'test' } });
    
    expect(screen.queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('does not show result if test string is empty', async () => {
    render(<RegexTesterTool />);
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: '' } });
    
    expect(screen.queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('shows "0 matches" badge when there is no match', async () => {
    render(<RegexTesterTool />);
    
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'apple' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'banana' } });

    await waitFor(() => {
      expect(screen.getByText('0 matches')).toBeInTheDocument();
    });
  });

  it('handles case-insensitive flag', async () => {
    render(<RegexTesterTool />);
    
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'apple' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'Apple' } });
    
    // Toggle case-insensitive flag ('i')
    const flagBtn = screen.getByText('i');
    fireEvent.click(flagBtn);

    await waitFor(() => {
      expect(screen.getByText('1 match')).toBeInTheDocument();
    });
  });

  it('shows multiple match details when global flag is active', async () => {
    render(<RegexTesterTool />);
    
    // Ensure 'g' is already there by default (from our implementation)
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'test test' } });

    await waitFor(() => {
      expect(screen.getByText('2 matches')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('index 5')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid regex patterns', async () => {
    render(<RegexTesterTool />);
    
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'INVALID(' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'some text' } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid regular expression/i)).toBeInTheDocument();
    });
  });

  it('shows timeout error message when worker results in timeout error', async () => {
    render(<RegexTesterTool />);
    
    fireEvent.change(screen.getByPlaceholderText(/your pattern here/i), { target: { value: 'RE-DOS' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter text to test against your pattern/i), { target: { value: 'aaa!' } });

    await waitFor(() => {
      expect(screen.getByText(/Regex execution timed out/i)).toBeInTheDocument();
    });
  });
});
