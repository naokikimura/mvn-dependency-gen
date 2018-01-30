mvn-dependency-gen
====

[![Build Status](https://travis-ci.org/naokikimura/mvn-dependency-gen.svg?branch=master)](https://travis-ci.org/naokikimura/mvn-dependency-gen) [![npm version](https://badge.fury.io/js/mvn-dependency-gen.svg)](https://badge.fury.io/js/mvn-dependency-gen)

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