package com.taskflow.controller;

import com.taskflow.dto.ProjectRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.service.ProjectService;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Project> create(@Valid @RequestBody ProjectRequest request, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(projectService.create(request, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Project>> listMine(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(projectService.findAllForUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> get(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
