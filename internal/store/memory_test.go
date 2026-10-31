package store

import (
  "context"
  "sync"
  "testing"
)
func TestLookup(t *testing.T) {
  s:=NewMemoryStore()
  code,ok,err:=s.Lookup(context.Background(),"DEMO-1001")
  if code!="001234"||!ok||err!=nil {t.Fatalf("unexpected: %q %v %v",code,ok,err)}
  _,ok,err=s.Lookup(context.Background(),"DEMO-9999")
  if ok||err!=nil {t.Fatal("expected missing")}
}
func TestConcurrentReads(t *testing.T) {
  s:=NewMemoryStore(); var wg sync.WaitGroup
  for i:=0;i<50;i++ {wg.Add(1);go func(){defer wg.Done();_,_,err:=s.Lookup(context.Background(),"DEMO-1001");if err!=nil {t.Error(err)}}()}
  wg.Wait()
}
