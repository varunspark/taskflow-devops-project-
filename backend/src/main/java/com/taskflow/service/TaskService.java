package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ActivityLogService activityLogService;

    public TaskService(TaskRepository taskRepository, ActivityLogService activityLogService) {
        this.taskRepository = taskRepository;
        this.activityLogService = activityLogService;
    }

    public Task create(TaskRequest request, String createdByUsername) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority());
        task.setProjectId(request.getProjectId());
        task.setAssignedToId(request.getAssignedToId());
        task.setDueDate(request.getDueDate());

        Task saved = taskRepository.save(task);

        activityLogService.log(saved.getId(), "TASK_CREATED", createdByUsername,
                Map.of("title", saved.getTitle()));

        return saved;
    }

    public List<Task> findByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
    }

    public Task update(Long id, TaskRequest request, String updatedByUsername) {
        Task task = findById(id);
        TaskStatus oldStatus = task.getStatus();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setAssignedToId(request.getAssignedToId());
        task.setDueDate(request.getDueDate());

        Task saved = taskRepository.save(task);

        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            activityLogService.log(saved.getId(), "STATUS_CHANGED", updatedByUsername,
                    Map.of("from", oldStatus.name(), "to", saved.getStatus().name()));
        }

        return saved;
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
