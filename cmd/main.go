package main

import (
	"flag"
	"fmt"
	"os"
)

// generateGreeting creates a greeting message for the given name
func generateGreeting(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

// getNameFromArgs parses command line arguments and returns the name to greet
func getNameFromArgs() string {
	var name string
	flag.StringVar(&name, "name", "World", "Name to greet")
	flag.Parse()

	if flag.NArg() > 0 {
		name = flag.Arg(0)
	}

	return name
}

func main() {
	name := getNameFromArgs()
	greeting := generateGreeting(name)
	fmt.Println(greeting)
	os.Exit(0)
}
