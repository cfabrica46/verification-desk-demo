package main

import (
  "context"
  "errors"
  "github.com/cfabrica46/verification-desk/internal/store"
  "github.com/cfabrica46/verification-desk/internal/verification"
)

type App struct { ctx context.Context; service *verification.Service }
func NewApp() *App { return &App{service:verification.NewService(store.NewMemoryStore())} }
func (a *App) startup(ctx context.Context) { a.ctx = ctx }

type VerificationLookupResult struct {
  Status string `json:"status"`
  Code string `json:"code,omitempty"`
  Message string `json:"message"`
  Reference string `json:"reference,omitempty"`
  Retryable bool `json:"retryable"`
}

func (a *App) GetVerificationCode(input string) VerificationLookupResult {
  ctx := a.ctx
  if ctx == nil { ctx = context.Background() }
  reference, code, err := a.service.GetCode(ctx, input)
  if err == nil {
    return VerificationLookupResult{Status:"success", Code:code, Reference:reference, Message:"Código ficticio encontrado."}
  }
  switch {
  case errors.Is(err, verification.ErrInvalidReference):
    return VerificationLookupResult{Status:"invalid_input", Message:"Ingresa una referencia DEMO válida."}
  case errors.Is(err, verification.ErrNotFound):
    return VerificationLookupResult{Status:"not_found", Message:"No existe un código de ejemplo."}
  case errors.Is(err, verification.ErrUnavailable), errors.Is(err, context.DeadlineExceeded):
    return VerificationLookupResult{Status:"unavailable", Message:"El almacén de prueba no está disponible.", Retryable:true}
  case errors.Is(err, context.Canceled):
    return VerificationLookupResult{Status:"error", Message:"Consulta cancelada.", Retryable:true}
  default:
    return VerificationLookupResult{Status:"error", Message:"No se pudo completar la consulta."}
  }
}
