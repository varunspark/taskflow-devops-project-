package com.taskflow.dto;

import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    @NotNull
    private Long projectId;
    private Long assignedToId;
    private LocalDateTime dueDate;
}
