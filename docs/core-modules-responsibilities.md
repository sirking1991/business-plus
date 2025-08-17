# Core Modules and Their Responsibilities

This document defines the core modules of the base accounting application and outlines their key responsibilities. It serves as a reference for future development and architectural decisions.

## 1. General Account Module
- Central ledger management for all financial transactions.
- Chart of accounts management.
- Journal entries and adjustments.
- Financial reporting and trial balance generation.

## 2. Receivables Module
- Management of customer invoices and payments.
- Tracking outstanding receivables.
- Aging reports and credit management.
- Integration with General Account for revenue recognition.

## 3. Payables Module
- Management of vendor bills and payments.
- Tracking outstanding payables.
- Payment scheduling and cash flow management.
- Integration with General Account for expense recognition.

## 4. Bank Reconciliation Module
- Import and matching of bank statements.
- Reconciliation of bank transactions with ledger entries.
- Handling discrepancies and adjustments.
- Reporting on reconciliation status.

## 5. Fixed Assets Module
- Asset register management.
- Depreciation calculation and schedules.
- Asset acquisition, disposal, and transfer tracking.
- Integration with General Account for asset valuation.

---

This foundational definition will guide the modular design and development of the base application.