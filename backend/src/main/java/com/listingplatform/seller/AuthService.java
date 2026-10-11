package com.listingplatform.seller;

import com.listingplatform.seller.dto.AuthResponse;
import com.listingplatform.seller.dto.LoginRequest;
import com.listingplatform.seller.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (sellerRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + normalizedEmail);
        }

        Seller seller = Seller.builder()
                .businessName(request.getBusinessName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        try {
            Seller savedSeller = sellerRepository.save(seller);
            String token = jwtUtils.generateToken(savedSeller.getId(), savedSeller.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .sellerId(savedSeller.getId())
                    .email(savedSeller.getEmail())
                    .businessName(savedSeller.getBusinessName())
                    .build();
        } catch (DataIntegrityViolationException e) {
            log.warn("Concurrent duplicate registration attempt for email: {}", normalizedEmail);
            throw new IllegalArgumentException("Email already registered: " + normalizedEmail);
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Seller seller = sellerRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), seller.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(seller.getId(), seller.getEmail());
        return AuthResponse.builder()
                .token(token)
                .sellerId(seller.getId())
                .email(seller.getEmail())
                .businessName(seller.getBusinessName())
                .build();
    }
}
