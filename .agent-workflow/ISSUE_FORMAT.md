# Format an issue

Guide the title and description format when creating or updating an issue. Use the user's request, conversation, and any existing issue text already available in context. This skill formats content only: it does not select, check, or configure providers, change dev-loop configuration or agent instructions, or perform external issue writes. The surrounding create/update workflow owns access, approval, and saving.

Use a concise, specific title and this description format:

```markdown
**Problem**

- Brief context and the behavior or gap that needs attention.

**Specification**

- Concise requirements and scope.

**Acceptance**

- A few observable, verifiable criteria.
```

Use Problem, Specification, and Acceptance as section labels, with clear, concise bullet items under each section. Do not combine a section's items into a paragraph.

- Preserve the user's intent and scope. Do not invent requirements or claim acceptance checks have passed.
- When formatting an update, retain still-applicable requirements and relevant context from the supplied issue text. Preserve unrelated issue metadata.
- Ask only about material missing content that prevents an accurate draft; do not ask provider or access questions.
- Return the formatted title and complete description as a preview for the surrounding create/update workflow.
