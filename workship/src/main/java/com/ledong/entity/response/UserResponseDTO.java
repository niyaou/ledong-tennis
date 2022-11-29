package com.ledong.entity.response;

import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private String token;
    private PrepaidCard user;
}
