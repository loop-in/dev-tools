'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { downloadFile } from '@/lib/utils';
import { Download } from 'lucide-react';

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'BETWEEN',
  'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN',
  'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INSERT INTO', 'VALUES', 'UPDATE',
  'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'ADD', 'INDEX',
  'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'UNIQUE', 'NOT NULL', 'DEFAULT', 'WITH',
  'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'EXISTS', 'RETURNING',
];

function formatSql(sql: string): string {
  let result = sql.replace(/\s+/g, ' ').trim();

  // Uppercase keywords
  const pattern = new RegExp(
    KEYWORDS.sort((a, b) => b.length - a.length)
      .map(k => k.replace(/\s+/g, '\\s+'))
      .join('|'),
    'gi'
  );
  result = result.replace(pattern, (m) => m.toUpperCase());

  // Add newlines before major clauses
  const clauses = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
    'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'WITH', 'UNION', 'UNION ALL', 'RETURNING'];

  for (const clause of clauses) {
    result = result.replace(new RegExp(`\\s(${clause})\\s`, 'g'), `\n${clause} `);
  }

  // Indent AND/OR
  result = result.replace(/\s+(AND|OR)\s+/g, '\n  $1 ');

  // Newline after comma in SELECT
  result = result.replace(/,\s*/g, ',\n  ');

  // Fix leading comma indent in FROM clause
  result = result.replace(/,\n  (FROM|WHERE|ORDER|GROUP|HAVING|LIMIT)/g, ',\n$1');

  return result.trim();
}

function minifySql(sql: string): string {
  return sql.replace(/--[^\n]*/g, '').replace(/\s+/g, ' ').trim();
}

export function SqlFormatterTool() {
  const [input, setInput] = useState(
    'select u.id, u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = 1 and u.created_at > \'2024-01-01\' group by u.id, u.name, u.email having count(o.id) > 0 order by order_count desc limit 20'
  );
  const [output, setOutput] = useState('');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button onClick={() => setOutput(formatSql(input))}>Format SQL</Button>
        <Button variant="secondary" size="sm" onClick={() => setOutput(minifySql(input))}>Minify</Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(output || input); setOutput(''); }}>
          ↕ Swap
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <span className="section-label">Input SQL</span>
          <Textarea monospace value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" placeholder="Paste SQL here…" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Formatted Output</span>
            <div className="flex items-center gap-2">
              {output && <Button variant="ghost" size="sm" onClick={() => downloadFile(output, 'query.sql')}><Download size={13} /></Button>}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          <pre className="tool-output min-h-[360px] whitespace-pre-wrap">
            {output || <span className="text-zinc-600">Formatted SQL will appear here…</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
