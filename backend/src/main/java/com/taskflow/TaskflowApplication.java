package com.taskflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the whole backend.
 * Running this class starts an embedded web server (Tomcat) on port 8080,
 * connects to MySQL (for Users/Projects/Tasks) and MongoDB (for Comments/ActivityLogs).
 */
@SpringBootApplication
public class TaskflowApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskflowApplication.class, args);
    }
}
