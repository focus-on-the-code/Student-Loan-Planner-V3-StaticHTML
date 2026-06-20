# Testing

Primary checks:

```bash
node --test tests/unit/*.test.js tests/official-examples/*.test.js
python3 -m http.server 8000
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/
```

Committed test reports live in `docs/test-reports/` and should include exact commands and outputs.
