package com.backend.pizzacustomer.setup;

import com.backend.pizzacustomer.TestDataUtil;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@EnableFeignClients
public abstract class SetUpForJwtClient {

   static WireMockServer mockService = new WireMockServer(3000);

   @DynamicPropertySource
   static void configureProperties(DynamicPropertyRegistry registry) {
      registry.add("spring.jpa.defer-datasource-initialization", () -> false);
      registry.add("spring.sql.init.mode", () -> "never");
   }

   @BeforeAll
   public static void setupMockJWtResponse() {
      mockService.start();

      mockService.stubFor(WireMock.get(WireMock.urlPathMatching("/jwt/create/random.*"))
              .willReturn(WireMock.aResponse()
                      .withStatus(200)
                      .withBody("token")
                      .withHeader("Content-Type", MediaType.TEXT_HTML_VALUE)));

      mockService.stubFor(WireMock.get(WireMock.urlPathMatching("/jwt/create/incorrectFormat.*"))
              .willReturn(WireMock.aResponse()
                      .withStatus(400)
                      .withBody("Email not valid")
                      .withHeader("Content-Type", MediaType.TEXT_HTML_VALUE)));

      mockService.stubFor(WireMock.get(WireMock.urlPathMatching("/jwt/verify/" + TestDataUtil.getCookie().getValue()))
              .willReturn(WireMock.aResponse()
                      .withStatus(200)
                      .withBody("{\"roles\":[\"USER\"], \"subject\": \"email@example.com\"}")
                      .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)));

      mockService.stubFor(WireMock.get(WireMock.urlPathMatching("/jwt/verify/invalid"))
              .willReturn(WireMock.aResponse()
                      .withStatus(401)));
   }
}