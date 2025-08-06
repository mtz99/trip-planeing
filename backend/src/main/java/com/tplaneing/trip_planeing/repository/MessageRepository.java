//Just a test, remove this file once no longer needed.
package com.tplaneing.trip_planeing.repository;

import com.tplaneing.trip_planeing.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository <Message, Long> {
}
