package com.taskflow.controller;

import com.taskflow.document.ActivityLog;
import com.taskflow.dto.TaskRequest;
import com.taskflow.entity.Task;
import com.taskflow.service.ActivityLogService;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final ActivityLogService activityLogService;

    public TaskController(TaskService taskService, ActivityLogService activityLogService) {
        this.taskService = taskService;
        this.activityLogService = activityLogService;
    }

    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody TaskRequest request, Principal principal) {
        return ResponseEntity.ok(taskService.create(request, principal.getName()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> listForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.findByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> get(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @Valid @RequestBody TaskRequest request,
                                        Principal principal) {
        return ResponseEntity.ok(taskService.update(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/activity")
    public ResponseEntity<List<ActivityLog>> activity(@PathVariable Long id) {
        return ResponseEntity.ok(activityLogService.findByTaskId(id));
    }
}
