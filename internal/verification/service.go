package verification

import (
	"context"
	"errors"
	"regexp"
	"strings"
)

var (
	ErrInvalidReference = errors.New("invalid demo reference")
	ErrNotFound         = errors.New("demo reference not found")
	ErrInvalidCode      = errors.New("invalid demo code")
	ErrUnavailable      = errors.New("demo store unavailable")
	codePattern         = regexp.MustCompile(`^[0-9]{6}$`)
	referencePattern    = regexp.MustCompile(`(?i)DEMO-[0-9]{4}`)
)

type CodeStore interface {
	Lookup(ctx context.Context, reference string) (code string, found bool, err error)
}

type Service struct{ store CodeStore }

func NewService(store CodeStore) *Service { return &Service{store: store} }

// NormalizeReference accepts only fictitious DEMO-#### identifiers, including
// those embedded in example URLs. It never fetches or opens the URL.
func NormalizeReference(input string) (string, error) {

	input = strings.TrimSpace(input)
	if input == "" || len(input) > 2048 {
		return "", ErrInvalidReference
	}

	matches := referencePattern.FindAllStringIndex(input, -1)

	var reference string

	isWord := func(c byte) bool {
		return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9'
	}

	for _, m := range matches {
		start, end := m[0], m[1]
		if start > 0 && isWord(input[start-1]) {
			continue
		}
		if end < len(input) && isWord(input[end]) {
			continue
		}
		current := strings.ToUpper(input[start:end])
		if reference != "" && current != reference {
			return "", ErrInvalidReference
		}
		reference = current
	}
	if reference == "" {
		return "", ErrInvalidReference
	}
	return reference, nil
}

func (s *Service) GetCode(ctx context.Context, input string) (reference, code string, err error) {
	reference, err = NormalizeReference(input)
	if err != nil {
		return "", "", err
	}
	if err = ctx.Err(); err != nil {
		return reference, "", err
	}
	code, found, err := s.store.Lookup(ctx, reference)
	if err != nil {
		return reference, "", ErrUnavailable
	}
	if !found {
		return reference, "", ErrNotFound
	}
	if !codePattern.MatchString(code) {
		return reference, "", ErrInvalidCode
	}
	return reference, code, nil
}
