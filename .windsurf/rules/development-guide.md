---
trigger: always_on
---

- follow docs/*.md when implementing features
- follow SOLID & DRY principles
- follow Test-Driven-Development
- the BREAD layout should follow these guidelines:
-- action buttons (save, edit, delete, back, etc) should be on top-right
-- delete (or any destructive action) should have user confirmation
-- in the list view, it should have search capability
-- Back button must always redirect to previous page. (e.g. `windows.history(-1)`)
