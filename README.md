mvn-dependency-gen
====

Installation
---

```bash
git clone https://github.com/naokikimura/mvn-dependency-gen.git
cd mvn-dependency-gen
npm install -g
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
