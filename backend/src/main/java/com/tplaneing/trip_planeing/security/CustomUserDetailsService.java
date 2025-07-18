package com.tplaneing.trip_planeing.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
public class CustomUserDetailsService implements UserDetailsService {

    // You would typically inject a UserRepository or similar here
    // private final UserRepository userRepository;
    //
    // public CustomUserDetailsService(UserRepository userRepository) {
    //     this.userRepository = userRepository;
    // }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // This is where you would load a user from your database
        // For demonstration, let's return a hardcoded user
        if ("testuser".equals(username)) {
            return User.withUsername("testuser")
                    .password("{noop}password") // Use {noop} for plain text if no encoder, but encoder is preferred
                    .roles("USER")
                    .build();
        }
        throw new UsernameNotFoundException("User not found: " + username);
    }
}
