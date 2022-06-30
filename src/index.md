---
title: jsanchesleao's dev blog
layout: home.njk
---

![avatar](https://avatars.githubusercontent.com/u/990967)

# jsanchesleao

{% for post in collections.posts %}
- {{post.data.date | postDate}}: [{{post.data.title}}]({{post.url}})
{% endfor %}
