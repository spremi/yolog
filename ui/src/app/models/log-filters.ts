//
// [yo-log]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { computed, signal, WritableSignal } from '@angular/core';
import { LOG_KEYS } from './log-column';

/**
 * Keys in log that will be considered for dynamic filters.
 */
export const DYNAMIC_FILTER_KEYS = [
  LOG_KEYS.ENV,
  LOG_KEYS.HOST,
  LOG_KEYS.SERVICE,
  LOG_KEYS.MODULE,
  LOG_KEYS.PROCESS,
  LOG_KEYS.THREAD,
  LOG_KEYS.TRACE_ID,
  LOG_KEYS.SPAN_ID,
  LOG_KEYS.SEVERITY,
  LOG_KEYS.IP,
] as const;

export type DynamicFilterKeys = typeof DYNAMIC_FILTER_KEYS[number];

/**
 * Defines a guard for checking if arbitrary 'string' is 'DynamicFilterKeys'.
 */
export function isDynamicFilterKey(key: string): key is DynamicFilterKeys {
  return (DYNAMIC_FILTER_KEYS as readonly string[]).includes(key);
}

/**
 * Map of values that are collected dynamically.
 */
export const CollectedValues: Record<DynamicFilterKeys, WritableSignal<Set<string>>> = {
  [LOG_KEYS.ENV]: signal<Set<string>>(new Set()),
  [LOG_KEYS.HOST]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SERVICE]: signal<Set<string>>(new Set()),
  [LOG_KEYS.MODULE]: signal<Set<string>>(new Set()),
  [LOG_KEYS.PROCESS]: signal<Set<string>>(new Set()),
  [LOG_KEYS.THREAD]: signal<Set<string>>(new Set()),
  [LOG_KEYS.TRACE_ID]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SPAN_ID]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SEVERITY]: signal<Set<string>>(new Set()),
  [LOG_KEYS.IP]: signal<Set<string>>(new Set()),
};

/**
 * Map of filters selected by the user.
 */
export const UserFilters: Record<DynamicFilterKeys, WritableSignal<Set<string>>> = {
  [LOG_KEYS.ENV]: signal<Set<string>>(new Set()),
  [LOG_KEYS.HOST]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SERVICE]: signal<Set<string>>(new Set()),
  [LOG_KEYS.MODULE]: signal<Set<string>>(new Set()),
  [LOG_KEYS.PROCESS]: signal<Set<string>>(new Set()),
  [LOG_KEYS.THREAD]: signal<Set<string>>(new Set()),
  [LOG_KEYS.TRACE_ID]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SPAN_ID]: signal<Set<string>>(new Set()),
  [LOG_KEYS.SEVERITY]: signal<Set<string>>(new Set()),
  [LOG_KEYS.IP]: signal<Set<string>>(new Set()),
};

/**
 * Encapsulates the state of filters.
 */
export interface LogFilters {
  [LOG_KEYS.ENV]: Set<string>;
  [LOG_KEYS.HOST]: Set<string>;
  [LOG_KEYS.MODULE]: Set<string>;
  [LOG_KEYS.SERVICE]: Set<string>;
  [LOG_KEYS.PROCESS]: Set<string>;
  [LOG_KEYS.THREAD]: Set<string>;
  [LOG_KEYS.TRACE_ID]: Set<string>;
  [LOG_KEYS.SPAN_ID]: Set<string>;
  [LOG_KEYS.SEVERITY]: Set<string>;
  [LOG_KEYS.IP]: Set<string>;
}

/**
 * Unified 'derived' signal for user filters.
 */
export const FilterValues = computed<LogFilters>(() => ({
  [LOG_KEYS.ENV]: UserFilters[LOG_KEYS.ENV](),
  [LOG_KEYS.HOST]: UserFilters[LOG_KEYS.HOST](),
  [LOG_KEYS.MODULE]: UserFilters[LOG_KEYS.MODULE](),
  [LOG_KEYS.SERVICE]: UserFilters[LOG_KEYS.SERVICE](),
  [LOG_KEYS.PROCESS]: UserFilters[LOG_KEYS.PROCESS](),
  [LOG_KEYS.THREAD]: UserFilters[LOG_KEYS.THREAD](),
  [LOG_KEYS.TRACE_ID]: UserFilters[LOG_KEYS.TRACE_ID](),
  [LOG_KEYS.SPAN_ID]: UserFilters[LOG_KEYS.SPAN_ID](),
  [LOG_KEYS.SEVERITY]: UserFilters[LOG_KEYS.SEVERITY](),
  [LOG_KEYS.IP]: UserFilters[LOG_KEYS.IP](),
}));
