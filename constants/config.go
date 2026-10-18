package constants

type TaskConfigData struct {
	ExtendFrom    string `json:"extendFrom"`
	ExtendOnStart bool   `json:"extendOnStart"`
	DateListCount int    `json:"dateListCount"`
}

type UpdateTaskConfigData struct {
	ExtendFrom    *string `json:"extendFrom"`
	ExtendOnStart *bool   `json:"extendOnStart"`
	DateListCount *int    `json:"dateListCount"`
}
