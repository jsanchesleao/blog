---
title: Hello World
layout: home.njk
---

# jsanchesleao's development journal

{% for post in collections.pages %}
- [{{post.data.title}}]({{post.url}})
{% endfor %}
