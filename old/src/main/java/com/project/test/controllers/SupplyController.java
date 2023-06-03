package com.project.test.controllers;

import com.project.test.entities.CompanyEntity;
import com.project.test.entities.SupplyEntity;
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
@RequestMapping("/supplies")
public class SupplyController {
  private final SupplyService supplyService;
  // private final CompanyService companyService;
  // private final SupplyRepository supplyRepository;
  // private final CompanyRepository companyRepository;

  public SupplyController(SupplyService supplyService
      // CompanyService companyService,
      // SupplyRepository supplyRepository,
      // CompanyRepository companyRepository

      ) {
    this.supplyService = supplyService;
    // this.companyService = companyService;
    // this.companyRepository = companyRepository;
    // this.supplyRepository = supplyRepository;
  }

  @GetMapping
  public ResponseEntity<List<SupplyEntity>> getAllSupplies() {
    List<SupplyEntity> supplies = supplyService.getAllSupplies();
    return ResponseEntity.ok(supplies);
  }

  @GetMapping("/{id}")
  public ResponseEntity<SupplyEntity> getSupplyById(@PathVariable("id") Long id) {
    SupplyEntity supply = supplyService.getSupplyById(id);
    return ResponseEntity.ok(supply);
  }

  @PostMapping
  public ResponseEntity<SupplyEntity> createSupply(@RequestBody SupplyEntity supply) {
    SupplyEntity createdSupply = supplyService.createSupply(supply);
    return ResponseEntity.ok(createdSupply);
  }

  @PutMapping("/{id}")
  public ResponseEntity<SupplyEntity> updateSupply(
      @PathVariable("id") Long id, @RequestBody SupplyEntity updatedSupply) {
    SupplyEntity supply = supplyService.updateSupply(id, updatedSupply);
    return ResponseEntity.ok(supply);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSupply(@PathVariable("id") Long id) {
    supplyService.deleteSupply(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{supplyId}/companies")
  public ResponseEntity<List<CompanyEntity>> getCompaniesBySupplyId(@PathVariable Long supplyId) {
    SupplyEntity supply = supplyService.getSupplyById(supplyId);
    List<CompanyEntity> companies = supply.getCompanies();
    return ResponseEntity.ok(companies);
  }

  // @PostMapping("/{supplyId}/companies/{companyId}")
  // public ResponseEntity<Void> addCompanyToSupply(
  //     @PathVariable("supplyId") Long supplyId, @PathVariable("companyId")
  //     Long companyId) {
  //   SupplyEntity supply = supplyService.getSupplyById(supplyId);
  //   CompanyEntity company = companyService.getCompanyById(companyId);
  //
  //   supply.getCompanies().add(company);
  //   company.getSupplies().add(supply);
  //
  //   supplyRepository.save(supply);
  //   companyRepository.save(company);

  // SupplyEntity supply = supplyService.getSupplyById(supplyId);
  // CompanyEntity company = companyService.getCompanyById(companyId);
  //
  // supply.getCompanies().add(company);
  // supplyService.updateSupply(supplyId, supply);

  //   return ResponseEntity.noContent().build();
  // }

  // @DeleteMapping("/{supplyId}/companies/{companyId}")
  // public ResponseEntity<Void> removeCompanyFromSupply(
  //     @PathVariable("supplyId") Long supplyId, @PathVariable("companyId")
  //     Long companyId) {
  //   SupplyEntity supply = supplyService.getSupplyById(supplyId);
  //   CompanyEntity company = companyService.getCompanyById(companyId);
  //
  //   supply.getCompanies().remove(company);
  //   supplyService.updateSupply(supplyId, supply);
  //
  //   return ResponseEntity.noContent().build();
  // }
}
