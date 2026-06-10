package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.entity.Equipment;
import com.cospace.entity.MeetingRoom;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.enums.WorkspaceType;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.WorkspaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
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

    @Test
    void getById_whenWorkspaceIsArchived_returnsNotFound() {
        Long workspaceId = 10L;
        MeetingRoom workspace = new MeetingRoom();
        workspace.setStatus(WorkspaceStatus.ARCHIVED);
        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));

        assertThatThrownBy(() -> workspaceService.getById(workspaceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Workspace not found");
    }

    @Test
    void update_changesOnlyEquipmentThatDiffers() {
        Long workspaceId = 10L;
        MeetingRoom workspace = new MeetingRoom();
        workspace.setName("Meeting Room A");
        workspace.setAddress("BMT Building");
        workspace.setCapacity(8);
        workspace.setPricePerHour(new BigDecimal("150000"));

        Equipment retainedEquipment = equipment("Wi-Fi", workspace);
        Equipment removedEquipment = equipment("Projector", workspace);
        workspace.getEquipment().add(retainedEquipment);
        workspace.getEquipment().add(removedEquipment);

        WorkspaceRequest request = new WorkspaceRequest(
                "Meeting Room A",
                WorkspaceType.MEETING_ROOM,
                "BMT Building",
                "3",
                8,
                new BigDecimal("150000"),
                WorkspaceStatus.AVAILABLE,
                null,
                List.of(" wi-fi ", "Whiteboard", "Whiteboard")
        );

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
        when(workspaceRepository.save(workspace)).thenReturn(workspace);

        workspaceService.update(workspaceId, request);

        assertThat(workspace.getEquipment())
                .contains(retainedEquipment)
                .doesNotContain(removedEquipment);
        assertThat(workspace.getEquipment())
                .extracting(Equipment::getName)
                .containsExactlyInAnyOrder("Wi-Fi", "Whiteboard");
        verify(workspaceRepository).save(workspace);
    }

    private Equipment equipment(String name, MeetingRoom workspace) {
        Equipment equipment = new Equipment();
        equipment.setName(name);
        equipment.setWorkspace(workspace);
        return equipment;
    }
}
