package com.taskflow.controller;

import com.taskflow.document.Comment;
import com.taskflow.dto.CommentRequest;
import com.taskflow.entity.User;
import com.taskflow.service.CommentService;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Comment> create(@Valid @RequestBody CommentRequest request, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(commentService.create(request, user.getId(), user.getUsername()));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Comment>> listForTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.findByTaskId(taskId));
    }
}
