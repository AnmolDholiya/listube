package com.listingplatform.seller;

import com.listingplatform.seller.dto.AuthResponse;
import com.listingplatform.seller.dto.LoginRequest;
import com.listingplatform.seller.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (sellerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Seller seller = Seller.builder()
                .businessName(request.getBusinessName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        Seller savedSeller = sellerRepository.save(seller);
        String token = jwtUtils.generateToken(savedSeller.getId(), savedSeller.getEmail());

        return new AuthResponse(token);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Seller seller = sellerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), seller.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(seller.getId(), seller.getEmail());
        return new AuthResponse(token);
    }
}
