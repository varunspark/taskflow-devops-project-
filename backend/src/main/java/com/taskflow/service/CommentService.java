package com.taskflow.service;

import com.taskflow.document.Comment;
import com.taskflow.dto.CommentRequest;
import com.taskflow.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ActivityLogService activityLogService;

    public CommentService(CommentRepository commentRepository, ActivityLogService activityLogService) {
        this.commentRepository = commentRepository;
        this.activityLogService = activityLogService;
    }

    public Comment create(CommentRequest request, Long userId, String username) {
        Comment comment = new Comment();
        comment.setTaskId(request.getTaskId());
        comment.setUserId(userId);
        comment.setUsername(username);
        comment.setText(request.getText());
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);

        activityLogService.log(request.getTaskId(), "COMMENT_ADDED", username,
                Map.of("commentId", saved.getId()));

        return saved;
    }

    public List<Comment> findByTaskId(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId);
    }
}
