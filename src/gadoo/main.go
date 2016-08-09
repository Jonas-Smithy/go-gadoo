package main

import (
	"gaboo/game"
	"gadoo/events"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

func serveWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 4096, 4096)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	client := game.Client{}

	var evts []events.Event
	eventHandler := events.LoginHandler
	for {
		err := conn.ReadJSON(&evts)
		if err != nil {
			log.Println(err)
			break
		}
		for _, evt := range evts {
			eventHandler = eventHandler(&evt)
			if eventHandler == nil {
				client.Close()
				return
			}
		}
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./HTML_ROOT")))
	http.HandleFunc("/ws", serveWebSocket)
	http.ListenAndServe("localhost:8080", nil)
}
