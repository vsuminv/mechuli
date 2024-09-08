//package com.example.mechuli.controller.error_controller;
//
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.GetMapping;
//
//@Controller
//@ControllerAdvice
//public class ErrorControllerAdvice {
//
//    @ExceptionHandler(Exception.class)
//    public String handleException(Exception ex) {
//        if (ex instanceof org.springframework.web.bind.MissingServletRequestParameterException) {
//            return "templates/error/error400";
//        } else if (ex instanceof org.springframework.web.HttpRequestMethodNotSupportedException) {
//            return "templates/error/error405.html";
//        } else {
//            System.out.println(ex.getMessage());
//            return "templates/error/error500";
//        }
//    }
//
//    @GetMapping("/error/403")
//    public String accessDenied(){
//        return "templates/error/error403";
//    }
//}
//
