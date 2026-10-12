package com.xiangqi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthCheckController {

    private final DataSource dataSource;

    public HealthCheckController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Xiangqi Backend");
        response.put("timestamp", System.currentTimeMillis());

        try (Connection conn = dataSource.getConnection()) {
            response.put("database", "CONNECTED");
            response.put("databaseProduct", conn.getMetaData().getDatabaseProductName());
            response.put("databaseVersion", conn.getMetaData().getDatabaseProductVersion());
        } catch (Exception e) {
            response.put("database", "DISCONNECTED");
            response.put("databaseError", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
