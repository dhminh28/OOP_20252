module com.coworking {
    requires transitive javafx.controls;
    requires javafx.fxml;
    requires javafx.base;
    requires transitive javafx.graphics;
    requires java.sql;

    exports com.coworking;
    exports com.coworking.controller;
    exports com.coworking.database;
    exports com.coworking.model;
    exports com.coworking.service;
    exports com.coworking.strategy;
    exports com.coworking.notification;
    exports com.coworking.factory;
    exports com.coworking.security;
    exports com.coworking.exception;
    opens com.coworking to javafx.fxml;
    opens com.coworking.controller to javafx.fxml, javafx.base;
    opens com.coworking.model to javafx.fxml, javafx.base;
    opens com.coworking.database;
}