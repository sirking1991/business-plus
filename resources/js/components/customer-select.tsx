import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown, X } from 'lucide-react';

type Getter<T> = (opt: T) => string | number;

interface SearchableSelectProps<T = any> {
  value?: string | number | null;
  onChange: (value: string) => void;
  options: T[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string; // optional, only for semantics if needed
  className?: string;
  // Generic mapping controls
  labelKey?: keyof T; // defaults to 'name'
  valueKey?: keyof T; // defaults to 'id'
  getOptionLabel?: (opt: T) => string; // takes precedence over labelKey
  getOptionValue?: Getter<T>; // takes precedence over valueKey
}

export default function SearchableSelect<T = any>({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled,
  id = 'entity_id',
  name,
  className,
  labelKey = 'name' as any,
  valueKey = 'id' as any,
  getOptionLabel,
  getOptionValue,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const stringValue = value == null ? '' : String(value);

  const labelOf = (opt: T): string => {
    if (getOptionLabel) return getOptionLabel(opt);
    try { return String((opt as any)[labelKey as any] ?? ''); } catch { return ''; }
  };
  const valueOf = (opt: T): string | number => {
    if (getOptionValue) return getOptionValue(opt);
    try { return (opt as any)[valueKey as any]; } catch { return ''; }
  };

  const selected = useMemo(() => options.find(o => String(valueOf(o)) === stringValue) || null, [options, stringValue]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => labelOf(o).toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      // focus search input when opened
      const input = containerRef.current?.querySelector<HTMLInputElement>('[data-role="search"]');
      input?.focus();
    }
  }, [open]);

  const handleSelect = (id: string | number) => {
    onChange(String(id));
    setOpen(false);
    setQuery('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-left ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`truncate ${selected ? '' : 'text-muted-foreground'}`}>
          {selected ? labelOf(selected as T) : placeholder}
        </span>
        <span className="flex items-center gap-1">
          {!!selected && !disabled && (
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" onClick={clearSelection} />
          )}
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2 border-b">
            <Input
              data-role="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-9"
            />
          </div>
          <ul ref={listRef} role="listbox" aria-labelledby={id} className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
            )}
            {filtered.map(opt => (
              <li key={String(valueOf(opt))}>
                <button
                  type="button"
                  role="option"
                  aria-selected={String(valueOf(opt)) === stringValue}
                  onClick={() => handleSelect(valueOf(opt))}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent ${String(valueOf(opt)) === stringValue ? 'bg-accent' : ''}`}
                >
                  <span className="truncate">{labelOf(opt)}</span>
                  {String(valueOf(opt)) === stringValue && (
                    <span className="text-xs text-muted-foreground">Selected</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Hidden input for semantics if needed */}
      {name && <input type="hidden" name={name} value={stringValue} />}
    </div>
  );
}
