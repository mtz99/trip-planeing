package com.tplaneing.trip_planeing.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private InMemoryUserDetailsManager inMemoryUserDetailsManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return inMemoryUserDetailsManager.loadUserByUsername(username);
    }

    @Autowired
    public void initialize() {
        User.UserBuilder users = User.builder();
        inMemoryUserDetailsManager.createUser(users.username("user").password(new BCryptPasswordEncoder().encode("password")).roles("USER").build());
    }
}
