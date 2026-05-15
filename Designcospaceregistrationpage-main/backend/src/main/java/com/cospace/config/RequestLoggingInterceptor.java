package com.cospace.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger LOGGER = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
    private static final String START_TIME_ATTRIBUTE = "requestStartTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTRIBUTE, System.nanoTime());
        return true;
    }

    @Override
    public void afterCompletion(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception exception
    ) {
        Object startTime = request.getAttribute(START_TIME_ATTRIBUTE);
        long durationMs = 0;
        if (startTime instanceof Long startTimeNanos) {
            durationMs = (System.nanoTime() - startTimeNanos) / 1_000_000;
        }

        if (exception == null) {
            LOGGER.info(
                    "{} {} -> {} ({} ms)",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    durationMs
            );
            return;
        }

        LOGGER.warn(
                "{} {} -> {} ({} ms) failed: {}",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                durationMs,
                exception.getMessage()
        );
    }
}
