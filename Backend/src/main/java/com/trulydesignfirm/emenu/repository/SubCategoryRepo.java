package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SubCategoryRepo extends JpaRepository<SubCategory, UUID> {
}
