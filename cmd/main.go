package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	var name string
	flag.StringVar(&name, "name", "World", "Name to greet")
	flag.Parse()

	if flag.NArg() > 0 {
		name = flag.Arg(0)
	}

	fmt.Printf("Hello, %s!\n", name)
	os.Exit(0)
}
