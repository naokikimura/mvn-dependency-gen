search-dependency
====

Installation
---

```bash
git clone https://github.com/naokikimura/search-dependency.git
cd search-dependency
npm install -g
```

Usage
---

```bash
{
  echo '<dependencies>';
  find . -name '*.jar' | search-dependency ;
  echo '</dependencies>';
} | xmlstarlet fo
```
