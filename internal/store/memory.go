package store

import "context"

// MemoryStore is immutable after construction, so concurrent lookups are safe.
type MemoryStore struct { records map[string]string }
func NewMemoryStore() *MemoryStore {
  return &MemoryStore{records: map[string]string{
    "DEMO-1001":"001234", "DEMO-1002":"450067", "DEMO-1003":"928105",
  }}
}
func (m *MemoryStore) Lookup(ctx context.Context, reference string) (string, bool, error) {
  if err := ctx.Err(); err != nil { return "", false, err }
  code, ok := m.records[reference]
  return code, ok, nil
}
