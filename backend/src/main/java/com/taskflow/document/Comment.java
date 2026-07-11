package com.taskflow.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * A comment left on a task. Stored in MongoDB (not MySQL) because:
 * - comment threads are naturally document-shaped (no fixed schema)
 * - very high write/read volume compared to core task data
 * - no need for strict relational integrity here
 */
@Document(collection = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    private String id;

    private Long taskId;      // references Task.id in MySQL
    private Long userId;      // references User.id in MySQL
    private String username;  // denormalized for fast display without a join
    private String text;
    private LocalDateTime createdAt;
}
