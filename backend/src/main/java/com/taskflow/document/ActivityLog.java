package com.taskflow.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * An audit trail entry: "who did what, when". Stored in MongoDB because
 * every action can carry a different shape of extra detail (the `details` map),
 * and audit logs are append-only / high volume - a great fit for a document store.
 */
@Document(collection = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

    @Id
    private String id;

    private Long taskId;
    private String action;        // e.g. "TASK_CREATED", "STATUS_CHANGED", "COMMENT_ADDED"
    private String performedBy;   // username
    private LocalDateTime timestamp;
    private Map<String, Object> details; // flexible extra info, e.g. {"from":"TODO","to":"DONE"}
}
