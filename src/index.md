---
title: Hello World
layout: base.njk
---

{% for post in collections.pages %}
- [{{post.data.title}}]({{post.url}})
{% endfor %}
