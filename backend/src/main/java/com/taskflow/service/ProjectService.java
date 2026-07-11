package com.taskflow.service;

import com.taskflow.dto.ProjectRequest;
import com.taskflow.entity.Project;
import com.taskflow.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project create(ProjectRequest request, Long ownerId) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwnerId(ownerId);
        return projectRepository.save(project);
    }

    public List<Project> findAllForUser(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
