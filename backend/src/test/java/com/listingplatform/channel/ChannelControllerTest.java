package com.listingplatform.channel;

import com.listingplatform.channel.dto.PublishBatchResponseDto;
import com.listingplatform.common.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ChannelControllerTest {

    @Mock
    private ChannelService channelService;

    @InjectMocks
    private ChannelController channelController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("seller", 1L, List.of());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);

        mockMvc = MockMvcBuilders.standaloneSetup(channelController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void testRetryPublishSuccessReturns200AndBatchInfo() throws Exception {
        UUID batchId = UUID.randomUUID();
        PublishBatchResponseDto dto = PublishBatchResponseDto.builder()
                .batchId(batchId)
                .status("PENDING")
                .totalCount(1)
                .skipped(List.of())
                .build();

        when(channelService.retryPublish(eq(42L), eq("FLIPKART"), anyLong())).thenReturn(dto);

        mockMvc.perform(post("/api/products/42/channels/FLIPKART/retry-publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.batchId").value(batchId.toString()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalCount").value(1));
    }

    @Test
    void testRetryPublishValidationFailureReturns400() throws Exception {
        when(channelService.retryPublish(eq(42L), eq("FLIPKART"), anyLong()))
                .thenThrow(new IllegalArgumentException("Pre-publish validation failed: Missing required fields: [hsn]"));

        mockMvc.perform(post("/api/products/42/channels/FLIPKART/retry-publish"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Pre-publish validation failed: Missing required fields: [hsn]"));
    }
}
