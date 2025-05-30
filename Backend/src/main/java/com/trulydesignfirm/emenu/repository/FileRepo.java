package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.ImageFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FileRepo extends JpaRepository<ImageFile, UUID> {
}
