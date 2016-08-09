package events

import (
	"encoding/json"
)

type EventType string

const (
	LoginEventType EventType = "Login"
)

type Event struct {
	Type EventType
	Data json.RawMessage
}

type LoginEvent struct {
	Name string
}
