package main

import (
	"flag"
	"os"
	"testing"
)

func TestGenerateGreeting(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "default world greeting",
			input:    "World",
			expected: "Hello, World!",
		},
		{
			name:     "custom name",
			input:    "Alice",
			expected: "Hello, Alice!",
		},
		{
			name:     "empty string",
			input:    "",
			expected: "Hello, !",
		},
		{
			name:     "name with spaces",
			input:    "John Doe",
			expected: "Hello, John Doe!",
		},
		{
			name:     "special characters",
			input:    "José-María",
			expected: "Hello, José-María!",
		},
		{
			name:     "numbers",
			input:    "User123",
			expected: "Hello, User123!",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := generateGreeting(tt.input)
			if result != tt.expected {
				t.Errorf("generateGreeting(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

func TestGetNameFromArgs(t *testing.T) {
	tests := []struct {
		name     string
		args     []string
		expected string
	}{
		{
			name:     "no arguments - default name",
			args:     []string{},
			expected: "World",
		},
		{
			name:     "name flag provided",
			args:     []string{"-name", "Alice"},
			expected: "Alice",
		},
		{
			name:     "name flag with equals",
			args:     []string{"-name=Bob"},
			expected: "Bob",
		},
		{
			name:     "positional argument only",
			args:     []string{"Charlie"},
			expected: "Charlie",
		},
		{
			name:     "positional argument overrides flag",
			args:     []string{"-name", "Alice", "Bob"},
			expected: "Bob",
		},
		{
			name:     "multiple positional arguments - first one wins",
			args:     []string{"First", "Second", "Third"},
			expected: "First",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset flag state for each test
			flag.CommandLine = flag.NewFlagSet(os.Args[0], flag.ExitOnError)

			// Set up os.Args to simulate command line arguments
			oldArgs := os.Args
			os.Args = append([]string{"cmd"}, tt.args...)
			defer func() { os.Args = oldArgs }()

			result := getNameFromArgs()
			if result != tt.expected {
				t.Errorf("getNameFromArgs() with args %v = %q, want %q", tt.args, result, tt.expected)
			}
		})
	}
}

func TestGetNameFromArgsEdgeCases(t *testing.T) {
	tests := []struct {
		name     string
		args     []string
		expected string
	}{
		{
			name:     "empty string as name flag",
			args:     []string{"-name", ""},
			expected: "",
		},
		{
			name:     "empty string as positional argument",
			args:     []string{""},
			expected: "",
		},
		{
			name:     "whitespace name",
			args:     []string{"-name", "   "},
			expected: "   ",
		},
		{
			name:     "name with newlines",
			args:     []string{"Hello\nWorld"},
			expected: "Hello\nWorld",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset flag state for each test
			flag.CommandLine = flag.NewFlagSet(os.Args[0], flag.ExitOnError)

			// Set up os.Args to simulate command line arguments
			oldArgs := os.Args
			os.Args = append([]string{"cmd"}, tt.args...)
			defer func() { os.Args = oldArgs }()

			result := getNameFromArgs()
			if result != tt.expected {
				t.Errorf("getNameFromArgs() with args %v = %q, want %q", tt.args, result, tt.expected)
			}
		})
	}
}
