package com.project.test.controllers;

import com.project.test.entities.CompanyEntity;
import com.project.test.entities.SupplyEntity;
import com.project.test.services.CompanyService;
import com.project.test.services.SupplyService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/companies")
public class CompanyController {
  private final CompanyService companyService;
  private final SupplyService supplyService;

  public CompanyController(CompanyService companyService, SupplyService supplyService) {
    this.companyService = companyService;
    this.supplyService = supplyService;
  }

  @GetMapping
  public ResponseEntity<List<CompanyEntity>> getAllCompanies() {
    List<CompanyEntity> companies = companyService.getAllCompanies();
    return ResponseEntity.ok(companies);
  }

  @GetMapping("/{id}")
  public ResponseEntity<CompanyEntity> getCompanyById(@PathVariable("id") Long id) {
    CompanyEntity company = companyService.getCompanyById(id);
    return ResponseEntity.ok(company);
  }

  @PostMapping
  public ResponseEntity<CompanyEntity> createCompany(@RequestBody CompanyEntity company) {
    CompanyEntity createdCompany = companyService.createCompany(company);
    return ResponseEntity.ok(createdCompany);
  }

  @PutMapping("/{id}")
  public ResponseEntity<CompanyEntity> updateCompany(
      @PathVariable("id") Long id, @RequestBody CompanyEntity updatedCompany) {
    CompanyEntity company = companyService.updateCompany(id, updatedCompany);
    return ResponseEntity.ok(company);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCompany(@PathVariable("id") Long id) {
    companyService.deleteCompany(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{companyId}/supplies/{supplyId}")
  public ResponseEntity<Void> addSupplyToCompany(
      @PathVariable("companyId") Long companyId, @PathVariable("supplyId") Long supplyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    SupplyEntity supply = supplyService.getSupplyById(supplyId);

    company.getSupplies().add(supply);
    companyService.updateCompany(companyId, company);

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{companyId}/supplies/{supplyId}")
  public ResponseEntity<Void> removeSupplyFromCompany(
      @PathVariable("companyId") Long companyId, @PathVariable("supplyId") Long supplyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    SupplyEntity supply = supplyService.getSupplyById(supplyId);

    company.getSupplies().remove(supply);
    companyService.updateCompany(companyId, company);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{companyId}/supplies")
  public ResponseEntity<List<SupplyEntity>> getSuppliesByCompanyId(@PathVariable Long companyId) {
    CompanyEntity company = companyService.getCompanyById(companyId);
    List<SupplyEntity> supplies = company.getSupplies();
    return ResponseEntity.ok(supplies);
  }
}
