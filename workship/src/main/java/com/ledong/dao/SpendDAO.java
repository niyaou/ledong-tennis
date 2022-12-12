package com.ledong.dao;

import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;
import java.util.List;

public interface SpendDAO extends JpaRepository<Spend, Serializable>, JpaSpecificationExecutor<Spend> {

    public Page<Spend> findByPrepaidCard_Id(Long id, Pageable pageParams );

    public Spend findByPrepaidCard_Id(Long id);

//    Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, Sort.by(orders));
//		return techProjectInfoRepository.findAll(c, pageReq);
}
