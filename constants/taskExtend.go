package constants

type TaskGroup struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Tasks []Task `json:"tasks"`
}

type Task struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Detail      string `json:"detail"`
	IsCompleted bool   `json:"isCompleted"`
}

type UpdateTask struct {
	ID          *string `json:"id"`
	Title       *string `json:"title"`
	Detail      *string `json:"detail"`
	IsCompleted *bool   `json:"isCompleted"`
}
