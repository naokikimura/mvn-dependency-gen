mvn-dependency-gen
====

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2990199ee50e491c968dcbcdf3515d0b)](https://www.codacy.com/app/n.kimura.cap/mvn-dependency-gen?utm_source=github.com&utm_medium=referral&utm_content=naokikimura/mvn-dependency-gen&utm_campaign=badger)
[![Build Status](https://travis-ci.org/naokikimura/mvn-dependency-gen.svg?branch=master)](https://travis-ci.org/naokikimura/mvn-dependency-gen)
[![npm version](https://badge.fury.io/js/mvn-dependency-gen.svg)](https://badge.fury.io/js/mvn-dependency-gen)

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