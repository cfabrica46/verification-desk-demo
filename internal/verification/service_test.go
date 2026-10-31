package verification

import (
  "context"
  "errors"
  "testing"
)
type fakeStore struct {code string; found bool; err error; got string}
func (f *fakeStore) Lookup(_ context.Context, ref string)(string,bool,error) {
  f.got=ref; return f.code,f.found,f.err
}
func TestNormalizeReference(t *testing.T) {
  for _, tc := range []struct{input,want string; invalid bool}{
    {"DEMO-1001","DEMO-1001",false},
    {"https://demo.example/verify/demo-1002","DEMO-1002",false},
    {" Example DEMO-1001 DEMO-1001 ","DEMO-1001",false},
    {"", "",true},
    {"abc123", "",true},
    {"DEMO-12345", "",true},
    {"DEMO-1001 DEMO-1002", "",true},
  } {
    got,err:=NormalizeReference(tc.input)
    if (err!=nil)!=tc.invalid || got!=tc.want {t.Errorf("%q: got %q, %v",tc.input,got,err)}
  }
}
func TestService(t *testing.T) {
  cases:=[]struct{name,code string;found bool;err,wantErr error; want string}{
    {name:"found",code:"001234",found:true,want:"001234"},
    {name:"not found",wantErr:ErrNotFound},
    {name:"invalid stored code",code:"abc123",found:true,wantErr:ErrInvalidCode},
    {name:"storage error",err:errors.New("opaque internal secret"),wantErr:ErrUnavailable},
  }
  for _,tc:=range cases {
    t.Run(tc.name,func(t *testing.T){
      f:=&fakeStore{code:tc.code,found:tc.found,err:tc.err}
      ref,code,err:=NewService(f).GetCode(context.Background(),"DEMO-1001")
      if ref!="DEMO-1001"||code!=tc.want||!errors.Is(err,tc.wantErr) {t.Fatalf("%s: %s %s %v",tc.name,ref,code,err)}
    })
  }
  ctx,cancel:=context.WithCancel(context.Background()); cancel()
  f:=&fakeStore{}
  _,_,err:=NewService(f).GetCode(ctx,"DEMO-1001")
  if !errors.Is(err,context.Canceled) {t.Fatal(err)}
}
