package utils

import "encoding/json"

func MarshalJSON(v interface{}) []byte {
	data, err := json.MarshalIndent(v, "", "  ")

	if err != nil {
		return []byte("{}")
	}
	return data
}
