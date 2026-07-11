package com.taskflow.service;

import com.taskflow.document.ActivityLog;
import com.taskflow.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void log(Long taskId, String action, String performedBy, Map<String, Object> details) {
        ActivityLog entry = new ActivityLog();
        entry.setTaskId(taskId);
        entry.setAction(action);
        entry.setPerformedBy(performedBy);
        entry.setTimestamp(LocalDateTime.now());
        entry.setDetails(details);
        activityLogRepository.save(entry);
    }

    public List<ActivityLog> findByTaskId(Long taskId) {
        return activityLogRepository.findByTaskIdOrderByTimestampDesc(taskId);
    }
}
