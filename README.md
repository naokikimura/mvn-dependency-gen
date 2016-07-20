mvn-dependency-gen
====

Generate a POM's dependency elements from JAR checksum.

Installation
---

```bash
npm install -g mvn-dependency-gen
```

Usage
---

```bash
{
  echo '<dependencies>';
  find . -name '*.jar' | mvn-dependency-gen;
  echo '</dependencies>';
} | xmlstarlet fo
```