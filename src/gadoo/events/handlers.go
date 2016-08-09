package events

import (
	"encoding/json"
	"log"
)

type EventHandler func(*Event) EventHandler

func LoginHandler(evt *Event) EventHandler {
	if evt.Type != LoginEventType {
		return LoginHandler
	}
	loginEvt := LoginEvent{}
	json.Unmarshal(evt.Data, &loginEvt)
	log.Println(loginEvt)
	return nil
}
