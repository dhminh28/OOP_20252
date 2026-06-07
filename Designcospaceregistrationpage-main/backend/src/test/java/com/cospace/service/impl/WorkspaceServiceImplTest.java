package com.cospace.service.impl;

import com.cospace.entity.MeetingRoom;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.WorkspaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceImplTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    private WorkspaceServiceImpl workspaceService;

    @BeforeEach
    void setUp() {
        workspaceService = new WorkspaceServiceImpl(workspaceRepository);
    }

    @Test
    void delete_whenWorkspaceExists_archivesInsteadOfDeleting() {
        Long workspaceId = 10L;
        MeetingRoom workspace = new MeetingRoom();
        when(workspaceRepository.existsById(workspaceId)).thenReturn(true);
        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));

        workspaceService.delete(workspaceId);

        assertThat(workspace.getStatus()).isEqualTo(WorkspaceStatus.ARCHIVED);
        verify(workspaceRepository).save(workspace);
        verify(workspaceRepository, never()).deleteById(workspaceId);
        verify(workspaceRepository, never()).delete(workspace);
    }

    @Test
    void delete_whenWorkspaceDoesNotExist_throwsNotFound() {
        Long workspaceId = 10L;
        when(workspaceRepository.existsById(workspaceId)).thenReturn(false);

        assertThatThrownBy(() -> workspaceService.delete(workspaceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Workspace not found");

        verify(workspaceRepository, never()).findById(workspaceId);
        verify(workspaceRepository, never()).save(org.mockito.ArgumentMatchers.any());
        verify(workspaceRepository, never()).deleteById(workspaceId);
    }
}
