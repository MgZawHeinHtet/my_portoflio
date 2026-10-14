import { appendFile, readFile } from 'node:fs/promises';
import process from 'node:process';

const [, , logPath, eventPath] = process.argv;

if (!logPath || !eventPath) {
  console.error('Usage: node append-event.mjs <events.jsonl> <event.json>');
  process.exit(2);
}

const event = JSON.parse(await readFile(eventPath, 'utf8'));

// The schema is the single source of truth for event names and per-event
// required fields. An append-only log makes a late failure expensive to repair,
// so every field a later validator reads is checked here, while the author can
// still fix the event trivially.
const schema = JSON.parse(await readFile(new URL('../schemas/event.schema.json', import.meta.url), 'utf8'));
const allowedEvents = new Set(schema.properties.event.enum);

if (typeof event !== 'object' || event === null || Array.isArray(event)) {
  throw new TypeError('Event must be a JSON object.');
}
if (typeof event.ts !== 'string' || !event.ts) {
  throw new TypeError('Event must contain a non-empty string ts.');
}
if (!allowedEvents.has(event.event)) {
  throw new TypeError(`Unsupported event type: ${event.event}`);
}
if (event.iteration !== null && (!Number.isInteger(event.iteration) || event.iteration < 1)) {
  throw new TypeError('iteration must be null or a positive integer.');
}

for (const constraint of conditionalConstraints(schema, event.event)) {
  for (const field of constraint.required ?? []) {
    if (!Object.hasOwn(event, field)) {
      throw new TypeError(`A ${event.event} event must contain ${field}.`);
    }
    checkField(event.event, field, event[field], constraint.properties?.[field] ?? schema.properties[field]);
  }
}

await appendFile(logPath, `${JSON.stringify(event)}\n`, 'utf8');
console.log(`Appended ${event.event} to ${logPath}`);

// Reads the narrow `if event const / then` form used by the event schema. This
// is not a general JSON Schema evaluator; it deliberately understands only the
// shape the schema uses, so the kit stays dependency-free.
function conditionalConstraints(eventSchema, eventType) {
  const constraints = [];
  for (const rule of eventSchema.allOf ?? []) {
    if (rule.if?.properties?.event?.const !== eventType) continue;
    if (rule.then) constraints.push(rule.then);
  }
  return constraints;
}

function checkField(eventType, field, value, fieldSchema) {
  if (!fieldSchema) return;
  if (Object.hasOwn(fieldSchema, 'const') && value !== fieldSchema.const) {
    throw new TypeError(`A ${eventType} event requires ${field}: ${JSON.stringify(fieldSchema.const)}.`);
  }
  if (fieldSchema.type === 'string' && (typeof value !== 'string' || value.length < (fieldSchema.minLength ?? 0))) {
    throw new TypeError(`A ${eventType} event requires ${field} to be a non-empty string.`);
  }
  if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
    throw new TypeError(`A ${eventType} event requires ${field} to be a boolean.`);
  }
}
