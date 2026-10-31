# Verification Desk

A self-contained desktop demonstration of a verification-code lookup workflow,
built with Go, Wails v2, vanilla JavaScript and CSS.

## Why
A non-technical user should be able to paste a reference or example URL,
retrieve a code, and copy it without learning backend infrastructure.

**This application uses only synthetic, locally stored values.** It never
connects to authentication systems or external infrastructure.
The output does not authenticate anything.

## Demo
- `DEMO-1001` → `001234`
- `DEMO-1002` → `450067`
- `DEMO-1003` → `928105`
- `DEMO-9999` → no result
- `https://demo.example/verify/DEMO-1001` → `001234`

## Architecture
`Wails UI → App adapter → Verification service → CodeStore → immutable MemoryStore`

The service validates and normalizes sample references, asks the store for a
string code, and reports distinct outcomes. No network client is required.
The UI handles loading, stale responses, errors, retry and clipboard feedback.

## Local development
Prerequisites: Go and Wails v2 toolchain, Node.js and dependencies required
by your operating system. Wails generates JavaScript bindings when building.

```bash
npm ci --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
go mod tidy
go test ./...
go test -race ./...
go vet ./...
wails dev
wails build
```

## Scope and limitations
- Demonstration only; no login, real OTPs or real integrations.
- Memory-only lookup, fixed synthetic fixtures, no persistence.
- Only references of the form `DEMO-####` are supported.
- Native desktop builds must be tested on each intended platform.
- This folder may have originated from a private working UI. **Permission to
  publish reused UI source and assets must be verified independently.**
