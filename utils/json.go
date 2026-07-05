package utils

import "encoding/json"

func MarshalJSON(v interface{}) []byte {
	data, err := json.MarshalIndent(v, "", "  ")

	if err != nil {
		return []byte("{}")
	}
	return data
}

func UnmarshalJSON(data []byte, v interface{}) error {
	err := json.Unmarshal(data, v)

	if err != nil {
		return err
	}
	return nil
}
