import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class SearchExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> invalidRequest(IllegalArgumentException exception) {
        return Map.of("error", exception.getMessage());
    }
}

@ExceptionHandler({org.springframework.data.elasticsearch.UncategorizedElasticsearchException.class, 
                   org.springframework.web.client.ResourceAccessException.class})
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
Map<String, String> handleElasticsearchDown(Exception exception) {
    return Map.of("error", "Search engine is currently unavailable. Please try again later.");
}

void main() {
}
