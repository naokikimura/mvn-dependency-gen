search-dependency
====

Usage
---

```bash
{
  echo '<dependencies>';
  find . -name '*.jar' | env DEBUG= node index.js ;
  echo '</dependencies>';
} | xmlstarlet fo
```