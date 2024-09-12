package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.Review_img;
import com.example.mechuli.repository.ReviewImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewImgService {

    private final ReviewImgRepository reviewImgRepository;

    @Autowired
    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}") // S3 버킷 이름을 application.yml에서 가져옴
    private String bucketName;

    @Transactional
    public List<Review_img> saveReviewImages(List<MultipartFile> imageFiles, Review review) throws IOException {
        List<String> imgUrls = uploadImagesToS3(imageFiles); // 이미지 업로드 후 URL 리스트 반환

        Review_img reviewImg = Review_img.builder()
                .review(review)
                .img1(imgUrls.size() > 0 ? imgUrls.get(0) : null)
                .img2(imgUrls.size() > 1 ? imgUrls.get(1) : null)
                .img3(imgUrls.size() > 2 ? imgUrls.get(2) : null)
                .build();

        reviewImgRepository.save(reviewImg);
        List<Review_img> reviewImgs = new ArrayList<>();
        reviewImgs.add(reviewImg);

        return reviewImgs;
    }

    public List<String> uploadImagesToS3(List<MultipartFile> imageFiles) throws IOException {
        List<String> imgUrls = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            String fileName = "images/" + file.getOriginalFilename();
            amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), null));
            String imageUrl = amazonS3.getUrl(bucketName, fileName).toString();
            imgUrls.add(imageUrl);
        }
        return imgUrls;
    }
}
