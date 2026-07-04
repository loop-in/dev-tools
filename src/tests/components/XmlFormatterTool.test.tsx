import { render, screen, fireEvent } from '@testing-library/react';
import { XmlFormatterTool, formatXml, minifyXml } from '@/components/tools/XmlFormatterTool';
import { describe, it, expect } from 'vitest';

describe('XmlFormatterTool Pure Functions', () => {
  const sampleXml = '<root><child id="1">Text here</child><empty/><!-- comment --></root>';

  it('formats XML with 2-space indentation', () => {
    const formatted = formatXml(sampleXml, 2, true);
    expect(formatted).toBe(
`<root>
  <child id="1">Text here</child>
  <empty/>
  <!-- comment -->
</root>`
    );
  });

  it('formats XML with 4-space indentation', () => {
    const formatted = formatXml(sampleXml, 4, true);
    expect(formatted).toBe(
`<root>
    <child id="1">Text here</child>
    <empty/>
    <!-- comment -->
</root>`
    );
  });

  it('formats XML and discards comments when keepComments is false', () => {
    const formatted = formatXml(sampleXml, 2, false);
    expect(formatted).toBe(
`<root>
  <child id="1">Text here</child>
  <empty/>
</root>`
    );
  });

  it('formats XML with DOCTYPE correctly without affecting depth', () => {
    const xmlWithDoctype = '<!DOCTYPE note SYSTEM "Note.dtd"><note><to>Tove</to></note>';
    const formatted = formatXml(xmlWithDoctype, 2, true);
    expect(formatted).toBe(
`<!DOCTYPE note SYSTEM "Note.dtd">
<note>
  <to>Tove</to>
</note>`
    );
  });

  it('minifies XML and discards comments', () => {
    const minified = minifyXml(sampleXml, false);
    expect(minified).toBe('<root><child id="1">Text here</child><empty/></root>');
  });

  it('minifies XML and keeps comments', () => {
    const minified = minifyXml(sampleXml, true);
    expect(minified).toBe('<root><child id="1">Text here</child><empty/><!-- comment --></root>');
  });
});

describe('XmlFormatterTool Component', () => {
  it('renders correctly with default state', () => {
    render(<XmlFormatterTool />);
    expect(screen.getByPlaceholderText(/<note>/i)).toBeInTheDocument();
    expect(screen.getByText('Formatted XML will appear here…')).toBeInTheDocument();
  });

  it('performs formatting on click', () => {
    render(<XmlFormatterTool />);
    const textarea = screen.getByPlaceholderText(/<note>/i);
    fireEvent.change(textarea, { target: { value: '<root><child>value</child></root>' } });
    
    // Check validation badge
    expect(screen.getByText('Valid XML')).toBeInTheDocument();

    const formatBtn = screen.getByText('Format');
    fireEvent.click(formatBtn);

    const outputElement = screen.getByText(
      (content) => content.includes('<root>') && content.includes('<child>value</child>'),
      { selector: 'pre' }
    );
    expect(outputElement).toBeInTheDocument();
  });

  it('performs minification on click', () => {
    render(<XmlFormatterTool />);
    const textarea = screen.getByPlaceholderText(/<note>/i);
    fireEvent.change(textarea, { target: { value: '<root>\n  <child>value</child>\n</root>' } });

    const minifyBtn = screen.getByText('Minify');
    fireEvent.click(minifyBtn);

    const outputElement = screen.getByText(
      (content) => content.includes('<root><child>value</child></root>'),
      { selector: 'pre' }
    );
    expect(outputElement).toBeInTheDocument();
  });

  it('shows error on invalid XML', () => {
    render(<XmlFormatterTool />);
    const textarea = screen.getByPlaceholderText(/<note>/i);
    fireEvent.change(textarea, { target: { value: '<root><child>unclosed</root>' } });

    expect(screen.getByText('Invalid XML')).toBeInTheDocument();

    const formatBtn = screen.getByText('Format');
    fireEvent.click(formatBtn);

    expect(screen.queryByText('Formatted XML will appear here…')).not.toBeInTheDocument();
  });
});
