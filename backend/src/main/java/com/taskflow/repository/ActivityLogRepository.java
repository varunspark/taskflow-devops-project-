package com.taskflow.repository;

import com.taskflow.document.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByTaskIdOrderByTimestampDesc(Long taskId);
}
