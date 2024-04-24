package com.backend.pizzacustomer.web.api;

import com.backend.pizzacustomer.web.dto.JwtResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@FeignClient(name = "jwt", url = "http://localhost:3000/jwt")
public interface JwtClient {

   @GetMapping("/create/{email}")
   String createJWT(@PathVariable String email);

   @GetMapping(value = "/verify/{token}")
   Optional<JwtResponseDto> validJwt(@PathVariable String token);
}
